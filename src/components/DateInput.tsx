import { DatePicker, Portal, Text, Box } from '@chakra-ui/react';
import { parseDate, today, getLocalTimeZone } from '@internationalized/date';
import { LuCalendar, LuChevronLeft, LuChevronRight } from 'react-icons/lu';

interface DateInputProps {
  label?: string;
  value: string; // YYYY-MM-DD
  max?: string; // YYYY-MM-DD
  onChange: (value: string) => void;
}

export const DateInput = ({ label, value, max, onChange }: DateInputProps) => {
  const dateValue = value ? [parseDate(value)] : [];
  const maxValue = max ? parseDate(max) : today(getLocalTimeZone());

  return (
    <DatePicker.Root
      value={dateValue}
      max={maxValue}
      locale="fr-FR"
      onValueChange={(details) => {
        if (details.value.length > 0) {
          onChange(details.value[0].toString());
        }
      }}
      openOnClick
    >
      {label && (
        <Box mb={2}>
          <Text fontSize="sm" color="fg.muted">
            {label}
          </Text>
        </Box>
      )}
      <DatePicker.Control>
        <DatePicker.Input />
        <DatePicker.IndicatorGroup>
          <DatePicker.Trigger>
            <LuCalendar />
          </DatePicker.Trigger>
        </DatePicker.IndicatorGroup>
      </DatePicker.Control>

      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.Header>
                <DatePicker.PrevTrigger>
                  <LuChevronLeft />
                </DatePicker.PrevTrigger>
                <DatePicker.ViewTrigger>
                  <DatePicker.RangeText />
                </DatePicker.ViewTrigger>
                <DatePicker.NextTrigger>
                  <LuChevronRight />
                </DatePicker.NextTrigger>
              </DatePicker.Header>
              <DatePicker.DayTable />
            </DatePicker.View>
            <DatePicker.View view="month">
              <DatePicker.Header>
                <DatePicker.PrevTrigger>
                  <LuChevronLeft />
                </DatePicker.PrevTrigger>
                <DatePicker.ViewTrigger>
                  <DatePicker.RangeText />
                </DatePicker.ViewTrigger>
                <DatePicker.NextTrigger>
                  <LuChevronRight />
                </DatePicker.NextTrigger>
              </DatePicker.Header>
              <DatePicker.MonthTable />
            </DatePicker.View>
            <DatePicker.View view="year">
              <DatePicker.Header>
                <DatePicker.PrevTrigger>
                  <LuChevronLeft />
                </DatePicker.PrevTrigger>
                <DatePicker.ViewTrigger>
                  <DatePicker.RangeText />
                </DatePicker.ViewTrigger>
                <DatePicker.NextTrigger>
                  <LuChevronRight />
                </DatePicker.NextTrigger>
              </DatePicker.Header>
              <DatePicker.YearTable />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  );
};
