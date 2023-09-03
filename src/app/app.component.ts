import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
import { UserService } from './services/user.service';
import { User } from './services/user_interface';
import { DBOperation } from './services/db-operation';
import { mustMatch } from './services/must-match-validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'registrationForm';
  // registerForm : FormGroup = new FormGroup({});
  registerForm: FormGroup;
  users: User[] = [];
  submitted : boolean =false;

  buttonText : string = "Submit";
  dbops : DBOperation;


  constructor(private toaster: ToastrService, private _fb: FormBuilder, private _userService: UserService) {

  }
  ngOnInit() {
    this.setFormState();
    this.getAllUsers();

  }

  setFormState() {
    this.buttonText = "Submit";
    this.dbops = DBOperation.create;

  //   this.registerForm = this._fb.group({
  //     id: [0],
  //     title: ['', Validators.required],
  //     // firstName : ['',Validators.required, Validators.minLength(3)]
  //     firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
  //     lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
  //     email: ['', Validators.compose([Validators.required, Validators.email])],
  //     dob: ['', Validators.compose([Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)])],
  //     password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
  //     confirmPassword: ['', Validators.required],
  //     acceptTerms: [false, Validators.requiredTrue]
  //   },{
  //     validators: mustMatch('password', 'confirmPassword')
  //   });
  // }


  this.registerForm = new FormGroup({
    id: new FormControl (0),
    title: new FormControl ('', Validators.required),
    // firstName : ['',Validators.required, Validators.minLength(3)]
    firstName: new FormControl ('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])),
    lastName: new FormControl ('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])),
    email: new FormControl ('', Validators.compose([Validators.required, Validators.email])),
    dob: new FormControl ('', Validators.compose([Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)])),
    password: new FormControl ('', Validators.compose([Validators.required, Validators.minLength(6)])),
    confirmPassword: new FormControl ('', Validators.required),
    acceptTerms: new FormControl (false, Validators.requiredTrue)
  },
     mustMatch('password', 'confirmPassword')
  );
}

   get f(){
    return this.registerForm.controls;
   }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    
    switch(this.dbops){
      case DBOperation.create:
       this._userService.addUser(this.registerForm.value).subscribe(res =>{
        this.toaster.success("User Added!", "User Registration");
        this.getAllUsers();
        this.onCancel();
       })
      break;
      case DBOperation.update:
        this._userService.updateUser(this.registerForm.value).subscribe(res =>{
          this.toaster.success("User Updated!", "User Registration");
          this.getAllUsers();
          this.onCancel();
         })

      break;
    }


  }

  onCancel() {
    this.registerForm.reset();
    this.buttonText = "Submit";
    this.dbops = DBOperation.create;
    this.submitted = false
  }
  getAllUsers() {
    this._userService.getUsers().subscribe((res: User[]) => {
      this.users = res;
      console.log(res);
    });
  }

  Edit(userId: number) {
    this.buttonText = "Update";
    this.dbops = DBOperation.update;

    let user = this.users.find((u :User)=> u.id === userId);
    this.registerForm.patchValue(user);

    this.registerForm.get('password').setValue('')
    this.registerForm.get('confirmPassword').setValue('')
    this.registerForm.get('acceptTerms').setValue(false)
  }

  Delete(userId: number) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover deleted record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: ' No, Keep it'

    })
      .then((reult) => {
        if (reult.value) {

          this._userService.deleteUser(userId).subscribe(res => {
            this.getAllUsers();
            // this.toaster.success("Deleted Successfully !", "User Regitration");

            Swal.fire(
              'Deleted!',
              'Your record has been deleted.',
              'success'
            )
          });

        
        }
        else if (reult.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'cancelleed',
            'Your record is safe :)',
            'error'
          )
        }

      }

      )
  }

}
