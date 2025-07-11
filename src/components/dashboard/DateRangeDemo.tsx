"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface DateRangePickerProps {
  backgroundColor?: string;
  selectedDayColor?: string;
  rangeDayColor?: string;
  textColor?: string;
  headerColor?: string;
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
  isOpen?: boolean;
  onClose?: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  backgroundColor = "#ffffff",
  selectedDayColor = "#f97316",
  rangeDayColor = "#fed7aa",
  textColor = "#000000",
  headerColor = "#6b7280",
  onDateRangeChange,
  isOpen = false,
  onClose,
  triggerRef,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const calendarRef = useRef<HTMLDivElement>(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  // Calculate position when opening
  useEffect(() => {
    if (isOpen && triggerRef?.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const calendarHeight = 400; // Approximate height
      const calendarWidth = 320; // Approximate width

      let top = triggerRect.bottom + 8;
      let left = triggerRect.left;

      // Adjust if calendar would go off bottom of screen
      if (top + calendarHeight > viewportHeight) {
        top = triggerRect.top - calendarHeight - 8;
      }

      // Adjust if calendar would go off right of screen
      if (left + calendarWidth > viewportWidth) {
        left = viewportWidth - calendarWidth - 16;
      }

      // Adjust if calendar would go off left of screen
      if (left < 16) {
        left = 16;
      }

      setPosition({ top, left });
    }
  }, [isOpen, triggerRef]);

  // Handle clicks outside calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        triggerRef?.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const isDateInHoverRange = (date: Date) => {
    if (!startDate || !hoverDate || !isSelectingEnd) return false;
    const rangeStart = startDate < hoverDate ? startDate : hoverDate;
    const rangeEnd = startDate < hoverDate ? hoverDate : startDate;
    return date >= rangeStart && date <= rangeEnd;
  };

  const isHoverEndDate = (date: Date) => {
    return hoverDate && isSelectingEnd && isSameDay(date, hoverDate);
  };

  const isStartDate = (date: Date) => {
    return startDate && isSameDay(date, startDate);
  };

  const isEndDate = (date: Date) => {
    return endDate && isSameDay(date, endDate);
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(clickedDate);
      setEndDate(null);
      setIsSelectingEnd(true);
      setHoverDate(null);
    } else if (startDate && !endDate) {
      // Complete the range
      if (clickedDate >= startDate) {
        setEndDate(clickedDate);
        setIsSelectingEnd(false);
        setHoverDate(null);
        onDateRangeChange?.(startDate, clickedDate);
      } else {
        // If clicked date is before start, make it the new start
        setStartDate(clickedDate);
        setEndDate(null);
        setHoverDate(null);
      }
    }
  };

  const handleDateHover = (day: number) => {
    if (isSelectingEnd && startDate) {
      const hoveredDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      setHoverDate(hoveredDate);
    }
  };

  const handleDateLeave = () => {
    if (isSelectingEnd) {
      setHoverDate(null);
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      const prevMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        0
      );
      const day = prevMonth.getDate() - i;
      days.push(
        <div
          key={`prev-${day}`}
          className="w-10 h-10 flex items-center justify-center text-sm cursor-pointer opacity-40"
          style={{ color: headerColor }}
        >
          {day}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isStart = isStartDate(date);
      const isEnd = isEndDate(date);
      const isInRange = isDateInRange(date);
      const isInHoverRange = isDateInHoverRange(date);
      const isHoverEnd = isHoverEndDate(date);
      const isToday = isSameDay(date, new Date());

      let dayStyle: React.CSSProperties = { color: textColor };
      let className =
        "w-10 h-10 flex items-center justify-center text-sm cursor-pointer relative z-10 transition-all";

      // Selected dates get circle background
      if (isStart || isEnd || isHoverEnd) {
        dayStyle = {
          backgroundColor: selectedDayColor,
          color: "#ffffff",
        };
        className += " rounded-full";
      } else {
        className += " rounded-full hover:bg-gray-100";
      }

      if (isToday && !isStart && !isEnd && !isHoverEnd) {
        className += " ring-2 ring-orange-300";
      }

      days.push(
        <div
          key={day}
          className={className}
          style={dayStyle}
          onClick={() => handleDateClick(day)}
          onMouseEnter={() => handleDateHover(day)}
          onMouseLeave={handleDateLeave}
        >
          {day}
        </div>
      );
    }

    // Next month's leading days
    const totalDaysShown = firstDay + daysInMonth;
    const weeksNeeded = Math.ceil(totalDaysShown / 7);
    const totalCells = weeksNeeded * 7;
    const remainingCells = totalCells - days.length;

    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div
          key={`next-${day}`}
          className="w-10 h-10 flex items-center justify-center text-sm cursor-pointer opacity-40"
          style={{ color: headerColor }}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  if (!isOpen) return null;

  return (
    <div
      ref={calendarRef}
      className="fixed z-50 p-4 rounded-lg w-80 font-sans border border-gray-200 shadow-lg"
      style={{
        backgroundColor,
        top: position.top,
        left: position.left,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-1 rounded hover:opacity-70 transition-opacity"
          style={{ color: textColor }}
        >
          <ChevronLeft size={20} />
        </button>

        <h2 className="text-lg font-medium" style={{ color: textColor }}>
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>

        <button
          onClick={() => navigateMonth("next")}
          className="p-1 rounded hover:opacity-70 transition-opacity"
          style={{ color: textColor }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="w-10 h-8 flex items-center justify-center text-sm font-medium"
            style={{ color: headerColor }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0 relative">
        {/* Range background bars */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {(() => {
            const daysInMonth = getDaysInMonth(currentDate);
            const firstDay = getFirstDayOfMonth(currentDate);
            const totalDaysShown = firstDay + daysInMonth;
            const weeksNeeded = Math.ceil(totalDaysShown / 7);

            return Array.from({ length: weeksNeeded }, (_, rowIndex) => (
              <div key={rowIndex} className="flex h-10 relative">
                {Array.from({ length: 7 }, (_, colIndex) => {
                  const dayIndex = rowIndex * 7 + colIndex;
                  const dayNumber = dayIndex - firstDay + 1;

                  if (dayNumber > 0 && dayNumber <= daysInMonth) {
                    const date = new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      dayNumber
                    );
                    const isInRange = isDateInRange(date);
                    const isInHoverRange = isDateInHoverRange(date);
                    const isStart = isStartDate(date);
                    const isEnd = isEndDate(date);
                    const isHoverEnd = isHoverEndDate(date);

                    // Determine if this cell should have range background
                    const showRange =
                      (isInRange || isInHoverRange) &&
                      !isStart &&
                      !isEnd &&
                      !isHoverEnd;
                    const showRangeStart =
                      isStart && (endDate || (isSelectingEnd && hoverDate));
                    const showRangeEnd = isEnd || isHoverEnd;

                    const isFirstInRow = colIndex === 0;
                    const isLastInRow = colIndex === 6;

                    // Check if range continues to next/previous rows
                    let rangeStartsInRow = false;
                    let rangeEndsInRow = false;

                    for (let i = 0; i < 7; i++) {
                      const checkDayNumber = rowIndex * 7 + i - firstDay + 1;
                      if (checkDayNumber > 0 && checkDayNumber <= daysInMonth) {
                        const checkDate = new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          checkDayNumber
                        );
                        if (isStartDate(checkDate)) {
                          rangeStartsInRow = true;
                        }
                        if (isEndDate(checkDate) || isHoverEndDate(checkDate)) {
                          rangeEndsInRow = true;
                        }
                      }
                    }

                    let className = "w-10 h-10";
                    let style: React.CSSProperties = {};

                    if (showRange || showRangeStart || showRangeEnd) {
                      className += " opacity-30";
                      style = { backgroundColor: rangeDayColor };

                      // Add rounded corners based on position
                      if (showRangeStart && !showRangeEnd) {
                        if (isFirstInRow || rangeStartsInRow) {
                          className += " rounded-l-full";
                        }
                      } else if (showRangeEnd && !showRangeStart) {
                        if (isLastInRow || rangeEndsInRow) {
                          className += " rounded-r-full";
                        }
                      } else if (showRange) {
                        if (isFirstInRow && !rangeStartsInRow) {
                          className += " rounded-l-full";
                        }
                        if (isLastInRow && !rangeEndsInRow) {
                          className += " rounded-r-full";
                        }
                      }
                    }

                    return (
                      <div key={colIndex} className={className} style={style} />
                    );
                  }
                  return <div key={colIndex} className="w-10 h-10" />;
                })}
              </div>
            ));
          })()}
        </div>

        {/* Calendar days */}
        {renderCalendar()}
      </div>
    </div>
  );
};

// Demo Component with Button
const DateRangePickerDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleDateRangeChange = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    setSelectedRange({ start: startDate, end: endDate });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRangeText = () => {
    if (selectedRange.start && selectedRange.end) {
      return `${formatDate(selectedRange.start)} - ${formatDate(
        selectedRange.end
      )}`;
    } else if (selectedRange.start) {
      return `${formatDate(selectedRange.start)} - Select end date`;
    } else {
      return "Select date range";
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Date Range Picker Demo
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date Range:
          </label>

          <button
            ref={triggerRef}
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          >
            <span
              className={`${
                selectedRange.start ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {getRangeText()}
            </span>
            <Calendar className="h-5 w-5 text-gray-400" />
          </button>

          {/* Display selected range */}
          {selectedRange.start && selectedRange.end && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                <span className="font-medium">Selected Range:</span>
                <br />
                From: {formatDate(selectedRange.start)}
                <br />
                To: {formatDate(selectedRange.end)}
              </p>
            </div>
          )}
        </div>

        <DateRangePicker
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onDateRangeChange={handleDateRangeChange}
          triggerRef={triggerRef as React.RefObject<HTMLElement>}
          backgroundColor="#ffffff"
          selectedDayColor="#f97316"
          rangeDayColor="#fed7aa"
          textColor="#000000"
          headerColor="#6b7280"
        />
      </div>
    </div>
  );
};

export default DateRangePickerDemo;
