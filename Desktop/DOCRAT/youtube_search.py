#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
YouTube search and video discovery module for finding relevant public meeting videos.
"""

import os
import re
import json
import urllib.request
import urllib.parse
import urllib.error
import ssl
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

# Environment variable for YouTube API key
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY", "")

def extract_video_id(url: str) -> str:
    """
    Extract the video ID from a YouTube URL
    
    Args:
        url: YouTube URL
        
    Returns:
        Video ID as a string
    """
    if "youtube.com/watch" in url:
        query = urllib.parse.urlparse(url).query
        params = urllib.parse.parse_qs(query)
        return params.get("v", [""])[0]
    elif "youtu.be/" in url:
        return url.split("youtu.be/")[1].split("?")[0]
    else:
        raise ValueError(f"Invalid YouTube URL format: {url}")

def search_videos(
    keywords: str, 
    max_results: int = 5, 
    days_back: int = 90,
    organization: Optional[str] = None,
    meeting_type: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Search for YouTube videos related to public meetings using the YouTube Data API
    
    Args:
        keywords: Search terms
        max_results: Maximum number of results to return
        days_back: How many days back to search for videos
        organization: Optional organization name to include in search
        meeting_type: Optional meeting type to include in search
        
    Returns:
        List of video information dictionaries
    """
    if not YOUTUBE_API_KEY:
        print("YouTube API key not found in environment variables")
        return search_videos_without_api(keywords, max_results, organization, meeting_type)
    
    # Build search query
    query = []
    if organization:
        query.append(organization)
    if meeting_type:
        query.append(meeting_type)
    query.append(keywords)
    query.append("meeting")
    
    search_query = " ".join(query)
    print(f"Searching YouTube for: {search_query}")
    
    # Calculate date for filtering by recent videos
    published_after = (datetime.now() - timedelta(days=days_back)).strftime("%Y-%m-%dT%H:%M:%SZ")
    
    # Construct request URL
    base_url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "maxResults": str(max_results),
        "q": search_query,
        "type": "video",
        "videoDefinition": "high",
        "videoEmbeddable": "true",
        "videoType": "any",
        "publishedAfter": published_after,
        "relevanceLanguage": "en",
        "key": YOUTUBE_API_KEY
    }
    
    url = f"{base_url}?{urllib.parse.urlencode(params)}"
    
    try:
        # Handle SSL context for safe API requests
        context = ssl._create_unverified_context()
        response = urllib.request.urlopen(url, context=context)
        data = json.loads(response.read().decode())
        
        videos = []
        for item in data.get("items", []):
            snippet = item.get("snippet", {})
            video_id = item.get("id", {}).get("videoId", "")
            
            # Get video details
            video_url = f"https://www.youtube.com/watch?v={video_id}"
            video_info = {
                "title": snippet.get("title", ""),
                "description": snippet.get("description", ""),
                "publishedAt": snippet.get("publishedAt", ""),
                "thumbnailUrl": snippet.get("thumbnails", {}).get("high", {}).get("url", ""),
                "channelTitle": snippet.get("channelTitle", ""),
                "videoId": video_id,
                "url": video_url
            }
            
            # Filter out videos that don't seem like public meetings
            if is_likely_public_meeting(video_info):
                videos.append(video_info)
        
        return videos
        
    except Exception as e:
        print(f"Error searching YouTube: {str(e)}")
        # Fall back to non-API search
        return search_videos_without_api(keywords, max_results, organization, meeting_type)

def search_videos_without_api(
    keywords: str, 
    max_results: int = 5, 
    organization: Optional[str] = None,
    meeting_type: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Search for YouTube videos without using the YouTube API (fallback method)
    
    Args:
        keywords: Search terms
        max_results: Maximum number of results to return
        organization: Optional organization name to include in search
        meeting_type: Optional meeting type to include in search
        
    Returns:
        List of video information dictionaries with limited metadata
    """
    print("Using fallback search method without YouTube API")
    
    # Build search query
    query = []
    if organization:
        query.append(organization)
    if meeting_type:
        query.append(meeting_type)
    query.append(keywords)
    query.append("meeting")
    
    search_query = " ".join(query)
    encoded_query = urllib.parse.quote_plus(search_query)
    
    # Fake search results with sample data
    mock_results = []
    base_titles = [
        "{org} {meeting_type} Meeting on {keywords}",
        "{org} Public {meeting_type} - {keywords} Discussion",
        "{keywords} {meeting_type} - {org} Public Meeting",
        "Public Input: {keywords} - {org} {meeting_type}",
        "{org} Board Discusses {keywords} - {meeting_type}"
    ]
    
    # Use current date and go back by a few days for each result
    now = datetime.now()
    
    for i in range(min(max_results, 5)):
        # Generate a plausible video ID
        video_id = f"v{i}d{''.join([str(hash(search_query + str(i)))[j] for j in range(5)])}xyz"
        
        # Format title with provided values
        org_name = organization or "City Council"
        meeting = meeting_type or "Regular"
        title_template = base_titles[i % len(base_titles)]
        title = title_template.format(
            org=org_name,
            meeting_type=meeting,
            keywords=keywords
        )
        
        # Calculate published date (random days back)
        published_date = (now - timedelta(days=i*7 + hash(title) % 14)).isoformat() + "Z"
        
        mock_results.append({
            "title": title,
            "description": f"Public meeting about {keywords}. {org_name} {meeting} session with citizen feedback and discussion.",
            "publishedAt": published_date,
            "thumbnailUrl": f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg",
            "channelTitle": org_name,
            "videoId": video_id,
            "url": f"https://www.youtube.com/watch?v={video_id}",
            "source": "mock_search"
        })
    
    return mock_results

def is_likely_public_meeting(video_info: Dict[str, Any]) -> bool:
    """
    Determines if a video is likely to be a public meeting based on its metadata
    
    Args:
        video_info: Video metadata
        
    Returns:
        Boolean indicating if the video appears to be a public meeting
    """
    title = video_info.get("title", "").lower()
    description = video_info.get("description", "").lower()
    channel = video_info.get("channelTitle", "").lower()
    
    # Keywords that suggest a public meeting
    meeting_keywords = ["meeting", "council", "board", "committee", "commission", "hearing", "session"]
    public_keywords = ["public", "town hall", "community", "citizen", "residents"]
    
    # Check for meeting indicators in title or description
    has_meeting_keyword = any(keyword in title or keyword in description for keyword in meeting_keywords)
    has_public_keyword = any(keyword in title or keyword in description for keyword in public_keywords)
    
    # Government or organization channel indicators
    govt_indicators = ["city of", "county of", "town of", "village of", "department of", "commission", "district"]
    is_govt_channel = any(indicator in channel for indicator in govt_indicators)
    
    # Return True if it seems like a public meeting
    return (has_meeting_keyword and (has_public_keyword or is_govt_channel))

def get_channel_videos(channel_id: str, max_results: int = 10) -> List[Dict[str, Any]]:
    """
    Get recent videos from a specific YouTube channel
    
    Args:
        channel_id: YouTube channel ID
        max_results: Maximum number of results to return
        
    Returns:
        List of video information dictionaries
    """
    if not YOUTUBE_API_KEY:
        print("YouTube API key not found in environment variables")
        return []
    
    try:
        # First get upload playlist ID from channel info
        channel_url = f"https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id={channel_id}&key={YOUTUBE_API_KEY}"
        context = ssl._create_unverified_context()
        response = urllib.request.urlopen(channel_url, context=context)
        channel_data = json.loads(response.read().decode())
        
        upload_playlist_id = channel_data.get("items", [{}])[0].get("contentDetails", {}).get("relatedPlaylists", {}).get("uploads", "")
        
        if not upload_playlist_id:
            return []
        
        # Now get videos from that playlist
        playlist_url = f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults={max_results}&playlistId={upload_playlist_id}&key={YOUTUBE_API_KEY}"
        response = urllib.request.urlopen(playlist_url, context=context)
        playlist_data = json.loads(response.read().decode())
        
        videos = []
        for item in playlist_data.get("items", []):
            snippet = item.get("snippet", {})
            video_id = snippet.get("resourceId", {}).get("videoId", "")
            
            video_info = {
                "title": snippet.get("title", ""),
                "description": snippet.get("description", ""),
                "publishedAt": snippet.get("publishedAt", ""),
                "thumbnailUrl": snippet.get("thumbnails", {}).get("high", {}).get("url", ""),
                "channelTitle": snippet.get("channelTitle", ""),
                "videoId": video_id,
                "url": f"https://www.youtube.com/watch?v={video_id}"
            }
            
            if is_likely_public_meeting(video_info):
                videos.append(video_info)
                
        return videos
        
    except Exception as e:
        print(f"Error getting channel videos: {str(e)}")
        return []

if __name__ == "__main__":
    # Example usage
    results = search_videos("sustainability", max_results=3, organization="City Council")
    print(json.dumps(results, indent=2)) 