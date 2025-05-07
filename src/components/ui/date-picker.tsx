
"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  className?: string
  mode?: "single" | "range" | "multiple"
  selected?: Date | Date[] | undefined
  onSelect?: (date: Date | undefined) => void
  required?: boolean
}

export function DatePicker({
  date,
  onDateChange,
  disabled,
  className,
  mode = "single",
  selected,
  onSelect,
  required = false,
}: DatePickerProps) {
  // Allow both controlled and uncontrolled usage
  const handleSelect = (selectedDate: Date | undefined) => {
    if (onSelect) {
      onSelect(selectedDate)
    }
    if (onDateChange) {
      onDateChange(selectedDate)
    }
  }
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-right font-normal",
            !date && !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="ml-2 h-4 w-4" />
          {(selected || date) ? (
            format(selected || date || new Date(), "dd/MM/yyyy")
          ) : (
            <span>בחר תאריך{required && "*"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode={mode}
          selected={selected || date}
          onSelect={handleSelect}
          disabled={disabled}
          initialFocus
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  )
}
