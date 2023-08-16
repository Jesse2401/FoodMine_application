import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IUserRegister } from 'src/app/shared/interfaces/IUserRegister';
import { PasswordMatchValidator } from 'src/app/shared/validators/password_match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
registerForm!:FormGroup;
isSubmitted=false;

returnUrl='';
constructor(private formBuilder:FormBuilder,
  private userService:UserService,
  private activatedService:ActivatedRoute,
  private router:Router ){}

ngOnInit(): void {
  this.registerForm = this.formBuilder.group({
    name:['',[Validators.required,Validators.minLength(2)]],
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.minLength(5)]],
    ConfirmPassword:['',[Validators.required]],
    address:['',[Validators.required,Validators.minLength(10)]],
  },{
    Validators:PasswordMatchValidator('password','confirmPassword'),
  });

  this.returnUrl=this.activatedService.snapshot.queryParams['returnUrl'];
  
}
 get fc(){
  return this.registerForm.controls;
 }

 submit(){
  this.isSubmitted=true;
  if(this.registerForm.invalid) return;

  const fv=this.registerForm.value;
  const user:IUserRegister={
    name:fv.name,
    email:fv.email,
    password:fv.password,
    confirmPassword:fv.confirmPassword,
    address:fv.address
  };

  this.userService.register(user).subscribe(_ =>{
    this.router.navigateByUrl(this.returnUrl);
  })
 }
}
