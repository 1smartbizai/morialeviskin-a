
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
  selected?: Date | Date[] | { from: Date; to: Date } | undefined
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
      onSelect(selectedDate);
    }
    if (onDateChange) {
      onDateChange(selectedDate);
    }
  }
  
  // Ensure we're displaying the proper date format
  const formattedDate = () => {
    if (selected instanceof Date || date instanceof Date) {
      return format(selected as Date || date as Date, "dd/MM/yyyy");
    }
    return undefined;
  }
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-right font-normal",
            !formattedDate() && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="ml-2 h-4 w-4" />
          {formattedDate() ? (
            formattedDate()
          ) : (
            <span>בחר תאריך{required && "*"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {mode === "single" && (
          <Calendar
            mode="single"
            selected={selected as Date || date}
            onSelect={handleSelect}
            disabled={disabled}
            initialFocus
            className="pointer-events-auto"
          />
        )}
        {mode === "range" && (
          <Calendar
            mode="range"
            selected={selected as { from: Date; to: Date }}
            onSelect={handleSelect as any}
            disabled={disabled}
            initialFocus
            className="pointer-events-auto"
          />
        )}
        {mode === "multiple" && (
          <Calendar
            mode="multiple"
            selected={selected as Date[]}
            onSelect={handleSelect as any}
            disabled={disabled}
            initialFocus
            className="pointer-events-auto"
          />
        )}
      </PopoverContent>
    </Popover>
  )
}
