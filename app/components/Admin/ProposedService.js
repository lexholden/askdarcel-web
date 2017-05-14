import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';

class ProposedService extends React.Component {
  constructor(props) {
    super(props);

    this.state = { schedule: {}, serviceFields: {}, notes: {}, schedule: {} };
    this.renderProposedServiceFields = this.renderProposedServiceFields.bind(this);
    this.changeFieldValue = this.changeFieldValue.bind(this);
    this.renderNotesFields = this.renderNotesFields.bind(this);
    this.renderScheduleFields = this.renderScheduleFields.bind(this);
    this.renderAdditionalFields = this.renderAdditionalFields.bind(this);
    this.changeScheduleValue = this.changeScheduleValue.bind(this);
    this.changeNoteValue = this.changeNoteValue.bind(this);
    this.changeServiceValue = this.changeServiceValue.bind(this);
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
          day
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

  changeScheduleValue(day, value, time) {
    let { schedule } = this.state;
    let tempSchedule = {};
    if(time == 'open') {
      tempSchedule = Object.assign({}, schedule, {[day]: Object.assign({}, schedule[day], { opens_at: value } )});  
    } else {
      tempSchedule = Object.assign({}, schedule, {[day]: Object.assign({}, schedule[day], { closes_at: value } )});  
    }
    debugger;
    this.setState({ schedule: tempSchedule });
  }

  changeNoteValue(note, value) {
    let tempNotes = Object.assign({}, this.state.notes, { [note]: value });
    this.setState({ notes: tempNotes });
  }

  changeServiceValue(serviceField, value) {
    let tempServiceFields = Object.assign({}, this.state.serviceFields, { [serviceField]: value });
    this.setState({ serviceFields: tempServiceFields });
  }
  renderScheduleFields() {
    let { schedule } = this.state;
    let scheduleOutput = [];
    for(let day in schedule) {
      scheduleOutput.push(
        <div key={"sched" + day} className="request-entry">
          <p className="request-cell name">{ "Opens at (" + schedule[day].day + ")"}</p>
          <TextareaAutosize className="request-cell value" value={schedule[day].opens_at} onChange={(e) => this.changeScheduleValue(day, e.target.value, 'open')} />
          <p className="request-cell name">{ "Closes at (" + schedule[day].day + ")"}</p>
          <TextareaAutosize className="request-cell value" value={schedule[day].closes_at} onChange={(e) => this.changeScheduleValue(day, e.target.value, 'close')} />
        </div>
      );
    }
    return scheduleOutput;
  }
  renderNotesFields() {
    let { notes } = this.state;
    let notesOutput = [];
    for(let note in notes) {
      notesOutput.push(
        <div key={"note" + note} className="request-entry">
          <p className="request-cell name">{`note ${note}`}</p>
          <TextareaAutosize className="request-cell value" value={notes[note]} onChange={(e) => this.changeNoteValue(note, e.target.value)} />
        </div>
      );
    }
    return notesOutput;
  }

  renderAdditionalFields() {
    let { serviceFields } = this.state;
    let additionalOutput = [];
    for(let field in serviceFields) {
      additionalOutput.push(
        <div key={field} className="request-entry">
          <p className="request-cell name">{field}</p>
          <TextareaAutosize className="request-cell value" value={serviceFields[field]} onChange={(e) => this.changeServiceValue(field, e.target.value)} />
        </div>
      );
    }
    return additionalOutput;
  }

  render() {
    let { notes, schedule, servicFields } = this.state;
    return (
      <div className="change-log">
        <div className="request-fields">
          {this.renderNotesFields()}
          {this.renderScheduleFields()}
          {this.renderAdditionalFields()}
        </div>
      </div>
    );
  }
}


export default ProposedService;
