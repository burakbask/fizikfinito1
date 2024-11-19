import React, { useState } from 'react';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { getCollectionItems } from '~/utils/directusClient';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import trLocale from '@fullcalendar/core/locales/tr';

// Directus'tan etkinlik verilerini çekiyoruz
export const loader = async () => {
  const eventsData = await getCollectionItems('events');
  return json({ eventsData });
};

export default function Calendar() {
  const { eventsData } = useLoaderData();

  const [calendarEvents, setCalendarEvents] = useState(
    eventsData.map((event: any) => ({
      id: event.id,
      title: event.title,
      start: event.start_date,
      end: event.end_date,
    }))
  );

  return (
    <div style={{

      padding: '0',
      width: '100%',
      height: '100%',
      minHeight: '100vh',
    }}>
      <div style={{

        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        width: '100%',
        height: '100%',
      }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          editable={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          locale={trLocale}
          dayHeaderContent={(day) => (
            <span style={{ color: 'black', fontWeight: 'bold' }}>{day.text}</span>
          )}
          eventContent={(eventInfo) => (
            <span style={{ color: 'black' }}>{eventInfo.event.title}</span>
          )}
          titleFormat={{ year: 'numeric', month: 'long' }}
          dayCellContent={(dayCell) => (
            <span style={{ color: 'black' }}>{dayCell.date.getDate()}</span>
          )}
        />
      </div>
    </div>
  );
}
