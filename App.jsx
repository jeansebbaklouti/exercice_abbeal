import React from 'react';
import ReactDOM from 'react-dom';
import fixtures from './test/fixtureStudents.js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' 

import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock  from 'react-bootstrap/lib/HelpBlock';
import Glyphicon  from 'react-bootstrap/lib/Glyphicon';


 

import styles from './css/style.css';

class App extends React.Component {
   constructor() {
      super();
		
      this.state = {
         data:fixtures()
      }
      this.addStudent = this.addStudent.bind(this);
      this.updateStudent = this.updateStudent.bind(this);
   }
   addStudent(newStudent){
    this.state.data.push(newStudent);
    // Update state
    this.setState({data: this.state.data});
   }

   updateStudent (id, newData){
     if(newData == null){
       this.setState({data: this.state.data.filter(student => student.id !== id)});
     }
     else{
        this.setState({data: this.state.data.map(student => student.id !== id?student:newData)});
     }

   }
	
   render() {
      return (
         <div>
           
            <div className="container">
            <Header/>
            <div className="row">
               <div className="col-md-9">
                 <StudentForm data={this.state.data} onChange={this.addStudent}/>
               </div>
             </div>   
            <div className="row">
               <div className="col-md-9">  
                <table className="table table-hover">
                      <thead>
                        <tr> <th>#</th><th>Nom</th> <th>Prénom</th>  <th>Classe</th><th>Suppression</th> </tr>
                      </thead>
                     <ReactCSSTransitionGroup transitionName="student_example" className="animated-list" component="tbody">
                      {this.state.data.map((person, i)=><TableRow key = {i} data = {person} onChange={this.updateStudent} />)}
                      </ReactCSSTransitionGroup>
                  </table>
                  <HelpBlock>Pour editer les informations d'un élève existant, "cliquer" sur le "champ" à modifier et presser "entrer" pour "sauvegarder". </HelpBlock>
                </div>
              </div>
              </div>
         </div>
      );
   }
}

class Header extends React.Component {
   render() {
      return (
         <div className="renard">
            <h1>Les élèves de Poudlard</h1>
         </div>
      );
   }
}

class TableRow extends React.Component {

   constructor(props){
     super(props);
     // This binding is necessary to make `this` work in the callback
     this.deleteStudent = this.deleteStudent.bind(this);
     //can be factorized
     this.editStudentName = this.editStudentName.bind(this);
     this.editStudentFirstName = this.editStudentFirstName.bind(this);
     this.editStudentClassRoom = this.editStudentClassRoom.bind(this);
     this.state = {editable: true};

   }
   deleteStudent(e){
       e.preventDefault();
       this.state = {editable: false};
       this.props.onChange(this.props.data.id);
   }
   editStudentName (editable,value){
      this.setState({editable:true});
      if(value !=null){
        this.props.data.name = value;
        this.props.onChange(this.props.data.id,this.props.data);
      }
   }

   editStudentFirstName (editable,value){
      this.setState({editable:true});
      if(value !=null){
        this.props.data.firstName = value;
        this.props.onChange(this.props.data.id,this.props.data);
      }
   }

  editStudentClassRoom (editable,value){
      this.setState({editable:true});
      if(value !=null){
        this.props.data.classRoom = value;
        this.props.onChange(this.props.data.id,this.props.data);
      }
   }
  
   render() {
      
      return (<tr>
                <Row rowElement={this.props.data.id} editable={false} />
                <Row rowElement={this.props.data.name} editable={this.state.editable} onChange={this.editStudentName}/>
                <Row rowElement={this.props.data.firstName} editable={this.state.editable}  onChange={this.editStudentFirstName}/>
                <Row rowElement={this.props.data.classRoom} editable={this.state.editable}  onChange={this.editStudentClassRoom}/>
                <td><button onClick={this.deleteStudent}><Glyphicon glyph="trash" /> </button></td> 
              </tr>
           );
   }
}
class Row extends React.Component {

  
   constructor(props){
     super(props);
      this.changeStudent = this.changeStudent.bind(this);
      this.saveStudent = this.saveStudent.bind(this);
      this.state ={editable:false}
     

   }
   changeStudent(e){
       e.preventDefault();
       this.setState({editable:true});
       this.props.onChange(true);
      
   }
   saveStudent (e){
    
      if (e.keyCode == 13) {
         e.preventDefault();
         this.setState({editable:false});
         this.props.onChange(true,e.target.value);
         
      }
   }

   render() {
      let td = null;
      if (this.state.editable && this.props.editable ) {
         td =  <td><input defaultValue={this.props.rowElement} onKeyDown={this.saveStudent} /></td>;
       } else {
         td =  <td onClick={this.changeStudent}>{this.props.rowElement}</td>;
       }       
      return (td);
   }
}
class StudentForm extends React.Component {

 constructor(props) {
    super(props);
    this.focus = this.focus.bind(this);
    this.addStudent = this.addStudent.bind(this);
  }

  newId(data){
     // just for fun, i do not that in prod
     return data.length==0?0:data.reduce((a,b)=>{return{id:Math.max(a.id,b.id)}}).id + 1;
  }

  focus() {
    // Explicitly focus the text input using the raw DOM API
    this.name.focus();
  }

  addStudent(e){
       e.preventDefault();
       this.props.onChange(
          {
            id: this.newId(this.props.data),
            name: this.name.value,
            firstName:this.firstName.value,
            classRoom:this.classRoom.value
           }
       );
       this.name.value = "";
       this.firstName.value = "";
       this.classRoom.value = "";
   }

 render() {
  return (
       <div>
             <form>
        <FormGroup
          controlId="formBasicText">
          <ControlLabel>Ajouter un éléve</ControlLabel>
          <FormControl
            type="text"
            ref={(input) => this.name = ReactDOM.findDOMNode(input)} 
            placeholder="nom"
          />
          <FormControl
            type="text"
            ref={(input) => this.firstName = ReactDOM.findDOMNode(input)} 
            placeholder="prénom"
          />
          <FormControl
            type="text"
            ref={(input) => this.classRoom = ReactDOM.findDOMNode(input)} 
            placeholder="Classe"
          />
          <FormControl.Feedback />
        </FormGroup>
         <Button type="submit"  onClick={this.addStudent}><Glyphicon glyph="plus"/>   Ajouter </Button>
        </form>
      
      </div>
    );
  }
}

export default App;