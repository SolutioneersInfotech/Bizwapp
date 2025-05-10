"use client"

import { useState, useEffect, useRef } from "react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { Smile } from "lucide-react"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
}

export default function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [showPicker, setShowPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  const handleEmojiSelect = (emoji: any) => {
    onEmojiSelect(emoji.native)
    setShowPicker(false)
  }

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="text-gray-500 hover:text-[#5682a3] transition-colors focus:outline-none"
      >
        <Smile className="h-5 w-5" />
      </button>

      {showPicker && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" previewPosition="none" />
        </div>
      )}
    </div>
  )
}

