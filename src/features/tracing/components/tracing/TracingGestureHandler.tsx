import React from 'react'
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler'

interface Props{
    children:React.ReactNode;
    enabled?:boolean;

    onTraceStart:(x:number,y:number)=>void;
    onTraceMove:(x:number,y:number)=>void;
    onTraceEnd:()=>void;
}

const TracingGestureHandler:React.FC<Props> = ({children,enabled=true,onTraceStart,onTraceMove,onTraceEnd}) => {
   
    const panGesture=usePanGesture({
        enabled,
        minDistance:0,
        runOnJS:true,
       onBegin:({x,y})=>onTraceStart(x,y),
       onUpdate:({x,y})=>onTraceMove(x,y),
       onFinalize:()=>onTraceEnd(),
    });


  return (
     <GestureDetector gesture={panGesture}>{children}</GestureDetector>
  )
}

export default TracingGestureHandler