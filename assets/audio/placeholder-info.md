# Audio Files Directory

This directory contains audio files for the Bit Pulse Podcast episodes.

## File Structure
```
assets/audio/
├── episode-001.mp3
├── episode-001.ogg
├── episode-002.mp3
├── episode-002.ogg
└── ...
```

## Audio Specifications
- **Format**: MP3 (primary), OGG (fallback)
- **Bitrate**: 128 kbps (recommended for web)
- **Sample Rate**: 44.1 kHz
- **Channels**: Stereo

## File Naming Convention
- `episode-XXX.mp3` - Main MP3 format
- `episode-XXX.ogg` - OGG Vorbis fallback format

## Adding New Episodes
1. Export audio in both MP3 and OGG formats
2. Name files according to the convention above
3. Update the corresponding episode HTML file with correct audio sources
4. Test playback across different browsers

## Optimization Tips
- Use consistent audio levels across episodes
- Apply noise reduction and audio enhancement
- Keep file sizes reasonable for web delivery
- Consider using a CDN for better performance

## Browser Compatibility
- MP3: Supported by all modern browsers
- OGG: Supported by Firefox, Chrome, Opera
- Having both formats ensures maximum compatibility 