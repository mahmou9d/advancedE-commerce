import { TToast } from "@customTypes/toasts";
import style from "./styles.module.css"
import { useAppDispatch } from "@store/hooks";
import { removeToast, stopDelayAnimation } from "@store/toasts/toastsSlice";
import { useCallback, useEffect, useState } from "react";


const {toastItem}=style
const ToastItem = ({
  id,
  type,
  title,
  message,
  delayAnimation
}: TToast) => {
  const dispatch = useAppDispatch();
  const [progressBarIndicator, setProgressBarIndicator] = useState(0);
  const [pauseProgressBarIndicator, setPauseProgressBarIndicator] =
    useState(false);
  const totalWidth = 100; // The progress bar width is 400 pixels, representing 100% completion.
  const duration = 4000; // Total duration in milliseconds
  const intervalTime = duration / totalWidth; // Interval time in milliseconds
  // const delayAnimationDuration = duration / 2;
  // const maxProgress = 100; // 100% completion
  const handleMouseEvent = () => {
    setPauseProgressBarIndicator((prevState) => !prevState);
  };
  const closeToastHandler = useCallback(() => {
    dispatch(removeToast(id));
  }, [id, dispatch]);
  useEffect(()=>{
    if(delayAnimation) return
    const time = setInterval(()=>{
      setProgressBarIndicator((prevState)=>{
        if (prevState < totalWidth && !pauseProgressBarIndicator) {
          return prevState + 1;
        }
        return prevState
      })
    },intervalTime)
    return ()=> clearInterval(time)
  },[intervalTime,delayAnimation,pauseProgressBarIndicator])

  useEffect(() => {
    if (progressBarIndicator === 100) {
      closeToastHandler();
    }
  }, [progressBarIndicator, closeToastHandler]);

useEffect(()=>{
  if (delayAnimation) {
    const time =setTimeout(()=>{
      dispatch(stopDelayAnimation(id))
    },1000)
    return () => clearTimeout(time)
  }
},[delayAnimation,dispatch,id])


  return (
    <div
      onMouseEnter={handleMouseEvent}
      onMouseLeave={handleMouseEvent}
      className={`alert alert-${type} ${toastItem}`}
    >
      <h5>{title ? title : type}</h5>
      <p>{message}</p>
      <button onClick={closeToastHandler} className="btn-close"></button>
      <span
        className="placeholder"
        style={{
          width: `${progressBarIndicator}%`,
          transition: `width ${intervalTime}ms linear`,
        }}
      ></span>
    </div>
  );
};

export default ToastItem
