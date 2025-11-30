import { Tabs } from 'antd';
import type { Dayjs } from 'dayjs';
import { useMemo, useRef } from 'react';
import { formatDate, formatDateDisplay, getDayName, getWeekDates } from '../utils/time-utils';

interface WeekNavigationHeaderProps {
  weekStart: Dayjs;
  selectedDate: Dayjs;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onTabChange: (date: Dayjs) => void;
}

export function WeekNavigationHeader({
  weekStart,
  selectedDate,
  onPrevWeek,
  onNextWeek,
  onTabChange,
}: WeekNavigationHeaderProps) {
  const tabbarRef = useRef<HTMLDivElement>(null);
  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);

  const handleTabChange = (key: string) => {
    const dateIndex = parseInt(key, 10);
    onTabChange(weekDates[dateIndex]);
  };

  const tabItems = weekDates.map((date, index) => ({
    key: index.toString(),
    label: (
      <div className="text-center min-w-[120px]">
        <div className="text-sm font-medium text-gray-700">{getDayName(date)}</div>
        <div className="text-xs text-gray-500">{formatDateDisplay(date)}</div>
      </div>
    ),
  }));

  return (
    <div
      ref={tabbarRef}
      className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          onClick={onPrevWeek}
          className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors shrink-0"
          aria-label="Previous week"
        >
          ←
        </button>
        <div className="flex-1 overflow-hidden">
          <Tabs
            activeKey={(() => {
              const index = weekDates.findIndex((d) => formatDate(d) === formatDate(selectedDate));
              return index !== -1 ? index.toString() : '0';
            })()}
            onChange={handleTabChange}
            items={tabItems}
            type="card"
            tabBarStyle={{
              marginBottom: 0,
            }}
            tabBarGutter={8}
            // Enable scrollable tabs - Ant Design automatically enables scroll when tabs overflow
            style={{
              width: '100%',
            }}
          />
        </div>
        <button
          onClick={onNextWeek}
          className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors shrink-0"
          aria-label="Next week"
        >
          →
        </button>
      </div>
    </div>
  );
}


