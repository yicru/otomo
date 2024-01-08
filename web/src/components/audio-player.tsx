'use client'

import { Progress } from '@/components/ui/progress'
import { secondsToDuration } from '@/lib/utils'
import { clsx } from 'clsx'
import { PauseIcon, PlayIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  className?: string
}

export const AudioPlayer = ({ src, className }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const audioRef = useRef<HTMLAudioElement>(null)

  const progress = (currentTime / duration) * 100

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => {
      if (audio.duration && audio.duration !== Infinity) {
        setDuration(audio.duration)
      }
    }
    const handleCanPlayThrough = () => setDuration(audio.duration)

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('canplaythrough', handleCanPlayThrough)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('canplaythrough', handleCanPlayThrough)
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current?.paused) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }

  return (
    <div className={clsx(className)}>
      {/* biome-ignore lint/a11y/useMediaCaption: ignore */}
      <audio ref={audioRef} src={src} controls className={'hidden'} />
      <Progress value={progress} className={'h-1'} />
      <div className={'flex justify-between mt-1 text-xs'}>
        <p>{secondsToDuration(currentTime)}</p>
        <p>{secondsToDuration(duration)}</p>
      </div>
      <div className={'flex justify-around items-center px-4 mt-2'}>
        <button
          type={'button'}
          className={
            'h-14 w-14 grid place-content-center bg-black text-white rounded-full'
          }
          onClick={togglePlay}
        >
          {isPlaying ? (
            <PauseIcon className={'h-6 w-6'} />
          ) : (
            <PlayIcon className={'h-6 w-6'} />
          )}
        </button>
      </div>
    </div>
  )
}
