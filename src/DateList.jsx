// Assuming you have a state variable called selectedDate and a list of dates

const DateList = ({ dates, selectedDate, onDateClick }) => {
  return (
    <ul>
      {dates.map((date) => (
        <li
          key={date}
          onClick={() => onDateClick(date)}
          className={date === selectedDate ? 'selected' : ''}
        >
          {date}
        </li>
      ))}
    </ul>
  );
};

export default DateList;