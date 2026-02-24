import { cn } from "@/lib/utils"
import { getMonth, getYear, setMonth, setYear } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"
import { DayPicker, useNavigation } from "react-day-picker"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

/* ── Custom Caption: clean month + year dropdowns with nav arrows ── */
function CustomCaption({ displayMonth }: { displayMonth: Date }) {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Read year bounds from the DayPicker context if available, else use defaults
  const fromYear = 1998;
  const currentYear = new Date().getFullYear();
  const toYear = currentYear - 5;

  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => fromYear + i
  );

  const selectClass =
    "text-xs font-semibold text-gray-700 border border-gray-200 bg-white rounded px-2 py-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-gray-300 transition-colors";

  return (
    <div className="flex items-center justify-between px-1 py-1 gap-2">
      {/* Prev month */}
      <button
        type="button"
        onClick={() => previousMonth && goToMonth(previousMonth)}
        disabled={!previousMonth}
        className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </button>

      {/* Month + Year dropdowns */}
      <div className="flex items-center gap-1.5">
        <select
          className={selectClass}
          value={getMonth(displayMonth)}
          onChange={(e) => goToMonth(setMonth(displayMonth, Number(e.target.value)))}
        >
          {months.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
        <select
          className={selectClass}
          value={getYear(displayMonth)}
          onChange={(e) => goToMonth(setYear(displayMonth, Number(e.target.value)))}
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Next month */}
      <button
        type="button"
        onClick={() => nextMonth && goToMonth(nextMonth)}
        disabled={!nextMonth}
        className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ── Calendar ── */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 select-none", className)}
      components={{
        Caption: CustomCaption as any,
      }}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-2",
        caption: "",           // CustomCaption fully owns this
        caption_label: "hidden", // hide the default label — CustomCaption replaces it
        nav: "hidden",           // hide default nav — CustomCaption has its own
        nav_button: "hidden",
        nav_button_previous: "hidden",
        nav_button_next: "hidden",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell:
          "text-gray-400 w-8 font-medium text-[0.7rem] text-center py-1",
        row: "flex w-full mt-1",
        cell: "h-8 w-8 text-center text-xs p-0 relative focus-within:relative focus-within:z-20",
        day: cn(
          "h-8 w-8 p-0 font-normal text-xs rounded",
          "hover:bg-blue-50 hover:text-blue-700 transition-colors",
          "aria-selected:opacity-100 flex items-center justify-center mx-auto"
        ),
        day_selected:
          "bg-blue-700 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white",
        day_today: "bg-blue-50 text-blue-700 font-semibold",
        day_outside: "text-gray-300 aria-selected:bg-blue-50 aria-selected:text-gray-300",
        day_disabled: "text-gray-300 cursor-not-allowed hover:bg-transparent hover:text-gray-300",
        day_range_middle: "aria-selected:bg-blue-50 aria-selected:text-blue-700",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar"

export { Calendar }
