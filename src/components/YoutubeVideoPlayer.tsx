import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Colors from '../constants/Colors';

interface YoutubeVideoPlayerProps {
  videoId: string;
  height?: number;
  width?: number;
}

const YoutubeVideoPlayer: React.FC<YoutubeVideoPlayerProps> = ({
  videoId,
  height = 250,
  width = Dimensions.get('window').width,
}) => {
  const [loading, setLoading] = useState(true);
  const webviewRef = useRef<WebView>(null);

  // This will inject JavaScript to pause the video when component unmounts
  useEffect(() => {
    const webview = webviewRef.current;
    return () => {
      if (webview) {
        // Inject JavaScript to pause YouTube video
        webview.injectJavaScript(`
          if (document.querySelector('iframe')) {
            document.querySelector('iframe').contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          }
          true;
        `);
      }
    };
  }, []);

  // Extract YouTube video ID from different YouTube URL formats
  const getYoutubeVideoId = (url: string): string => {
    // Handle youtu.be format
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }

    // Handle youtube.com/watch?v= format
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      return urlParams.get('v') || '';
    }

    // Handle youtube.com/embed/ format
    if (url.includes('/embed/')) {
      return url.split('/embed/')[1].split('?')[0];
    }

    // If it's already an ID, return as is
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }

    return '';
  };

  const extractedVideoId = getYoutubeVideoId(videoId);

  // Use the YouTube iframe API with enablejsapi=1 to allow JavaScript control
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            overflow: hidden; 
            background-color: black; 
            height: 100%; 
            width: 100%;
          }
          iframe { 
            width: 100%; 
            height: 100%; 
            position: absolute; 
            top: 0; 
            left: 0;
          }
        </style>
      </head>
      <body>
        <iframe 
          id="ytplayer"
          src="https://www.youtube.com/embed/${extractedVideoId}?playsinline=1&rel=0&enablejsapi=1"
          frameborder="0" 
          allowfullscreen="allowfullscreen"
          allow="autoplay; encrypted-media"
          mozallowfullscreen="mozallowfullscreen" 
          msallowfullscreen="msallowfullscreen" 
          oallowfullscreen="oallowfullscreen" 
          webkitallowfullscreen="webkitallowfullscreen">
        </iframe>
      </body>
    </html>
  `;

  return (
    <View style={[styles.container, { width, height }]}>
      <WebView
        ref={webviewRef}
        source={{html: htmlContent}}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsFullscreenVideo={true}
        mediaPlaybackRequiresUserAction={Platform.OS === 'ios'}
        allowsInlineMediaPlayback={true}
        onLoadEnd={() => setLoading(false)}
        scrollEnabled={false}
        onError={(syntheticEvent) => {
          console.log('WebView error: ', syntheticEvent.nativeEvent);
        }}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.main} size="large" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default YoutubeVideoPlayer;
