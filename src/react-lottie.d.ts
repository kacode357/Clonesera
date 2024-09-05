declare module 'react-lottie' {
    import { Component } from 'react';
  
    export interface LottieProps {
      options: {
        loop?: boolean;
        autoplay?: boolean;
        animationData: any;
        rendererSettings?: {
          preserveAspectRatio?: string;
        };
      };
      height?: number | string;
      width?: number | string;
      isStopped?: boolean;
      isPaused?: boolean;
      eventListeners?: Array<{
        eventName: string;
        callback: () => void;
      }>;
      segments?: number[] | boolean;
    }
  
    export default class Lottie extends Component<LottieProps> {}
  }
  