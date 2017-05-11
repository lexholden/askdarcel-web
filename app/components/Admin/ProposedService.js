import React from 'react';

class ProposedService extends React.component {
  constructor(props) {
    super(props);
  
    this.state = { schedule: {}, service: { notes: {}, schedules: {}, } };

  }

  componentDidMount() {
    let tempService = this.props.service;
    let newService = this.state.service;

    for(let field in service) {
      if(service.hasOwnProperty(field) && field !== 'id' && field !== 'resource') {
        if(field === "notes") {
          let notes = service[field];
          let tempNoteObj = {};
          notes.forEach((curr, i) => {
            newService.notes[i] = curr.note;
          });
        }
        else if (field === "schedule") {
          let schedule = service[field];
          let scheduleDays = schedule.schedule_days;
          scheduleDays.forEach((day, i) => {
            newService.schedules[i] = { day: day.day, opens_at: date.opens_at, closes_at: date.closes_at }
          })
        }
        else {
          newService[field] = service[field];
        }
      }
    }
  }
  
  render() {
    return (
      <div className="change-log">
          {renderProposedService(props.service)}
      </div>
    );
  }
}

function renderProposedService(service) {
    return (
        <div className="request-fields">
            {renderProposedServiceFields(service)}
        </div>
    );
}

function renderProposedServiceFields(service) {
    console.log(service);
    let jsx = [];

    for(let field in service) {
        if(service.hasOwnProperty(field) && field !== 'id' && field !== 'resource') {
            if(field === "notes") {
                let notes = service[field];
                let tempNoteObj = {};
                notes.forEach((note, i) => {
                  tempNoteObj[i] = note.note;
                    // jsx.push(tableEntry("note"+noteCount++, "note", note.note));
                });
            }
            else if (field === "schedule") {
                let schedule = service[field];
                let scheduleDays = schedule.schedule_days;
                scheduleDays.forEach((day) => {
                    jsx.push(
                        tableEntry(
                            "sched"+day.day,
                            "Schedule ("+day.day+")",
                            "Opens at: "+day.opens_at+", Closes at: "+day.closes_at
                        )
                    );
                })
            }
            else {
                jsx.push(tableEntry(field, field, service[field]));
            }
        }
    }

    return jsx;
}
// function renderProposedServiceFields(service) {
//     let jsx = [];
//     for(let field in service) {
//         if(service.hasOwnProperty(field) && field !== 'id' && field) {
//             if(field !== 'notes' && field !== 'schedule')
//                 jsx.push(
//                     tableEntry(field, field, service[field])
//                 );
//         }
//     }
//
//     return jsx;
// }

function tableEntry(key, fieldName, value) {
    return (
        <div key={key} className="request-entry">
            <p className="request-cell name">{fieldName}</p>
            <p className="request-cell value">{value}</p>
        </div>
    );
}

export default ProposedService;
