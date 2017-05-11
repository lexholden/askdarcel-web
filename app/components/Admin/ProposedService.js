import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';

class ProposedService extends React.Component {
  constructor(props) {
    super(props);

    this.state = { schedule: {}, serviceFields: {}, notes: {}, schedule: {} };
    this.renderProposedServiceFields = this.renderProposedServiceFields.bind(this);
    this.changeFieldValue = this.changeFieldValue.bind(this);
  }

  componentDidMount() {
    let tempService = this.props.service;
    let newServiceFields = this.state.serviceFields;
    let tempNotes = this.state.notes;
    let tempSchedule = this.state.schedule;

    for (let field in tempService) {
      if (tempService.hasOwnProperty(field) && field !== 'id' && field !== 'resource') {
        if (field === "notes") {
          let notes = tempService[field];
          let tempNoteObj = {};
          notes.forEach((curr, i) => {
            tempNotes[i] = curr.note;
          });
        } else if (field === "schedule") {
          let schedule = tempService[field];
          let scheduleDays = schedule.schedule_days;
          scheduleDays.forEach((day, i) => {
            tempSchedule[i] = { day: day.day, opens_at: day.opens_at, closes_at: day.closes_at }
          })
        } else {
          newServiceFields[field] = tempService[field];
        }
      }
    }
    this.setState({ serviceFields: newServiceFields, notes: tempNotes, schedule: tempSchedule });
  }

  renderProposedServiceFields(serviceFields, notes, schedule) {
    let jsx = [];
    for(let note in notes) {
      jsx.push(this.tableEntry("note" + note, "note", notes[note], note));
    }

    for(let day in schedule) {
      jsx.push(
        this.tableEntry(
          "sched" + schedule[day].day,
          "Schedule (" + schedule[day].day + ")",
          "Opens at: " + schedule[day].opens_at + ", Closes at: " + schedule[day].closes_at, 
          day, "schedule"
        )
      );
    }

    for(let field in serviceFields) {
      jsx.push(this.tableEntry(field, field, service[field]));
    }
    return jsx;
  }

  changeFieldValue(fieldName, value, index) {
    // if(fieldName === "notes") {
    //   let tempNotes = this.state.notes;
    //   tempNotes[index] = value;
    //   this.setState({ notes: tempNotes });
    // }
  }

  // tableEntry(key, fieldName, value, index, type) {
  //   return (
  //     <div key={key} className="request-entry">
  //       <p className="request-cell name">{fieldName}</p>
  //       <TextareaAutosize className="request-cell value" value={this.state[fieldName][index]} onChange={(e) => this.changeFieldValue(fieldName, e.target.value, index)} />
  //     </div>
  //   );
  // }

  scheduleEntry() {}
  noteEntry() {}
  serviceFieldEntry() {}

  render() {
    let { notes, schedule, servicFields } = this.state;
    return (
      <div className="change-log">
        <div className="request-fields">
          {this.renderProposedServiceFields(servicFields, notes, schedule)}
        </div>
      </div>
    );
  }
}


export default ProposedService;
