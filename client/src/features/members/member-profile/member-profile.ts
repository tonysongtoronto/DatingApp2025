import { Component, effect, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule],

  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit,OnDestroy {

 @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }
  private route = inject(ActivatedRoute);

    private accountService = inject(AccountService);
   protected memberService = inject(MemberService);
     private toast = inject(ToastService);
  protected member = signal<Member | undefined>(undefined);

    protected editableMember: EditableMember = {
    displayName: '',
    description: '',
    city: '',
    country: ''
  }

  private isInitialized = false;

   constructor() {  // 新增：constructor
    // 自动同步 memberService.member() 的变化
    effect(() => {
      if (!this.isInitialized) return;

      // 只在非编辑模式下自动同步
      if (this.memberService.editMode()) return;

      const serviceMember = this.memberService.member();
      if (serviceMember) {
        this.editableMember = {
          displayName: serviceMember.displayName || '',
          description: serviceMember.description || '',
          city: serviceMember.city || '',
          country: serviceMember.country || ''
        };

          this.member.set(serviceMember);


      }
    });
  }






  ngOnInit(): void {

      this.editableMember = {
      displayName: this.memberService.member()?.displayName || '',
      description: this.memberService.member()?.description || '',
      city: this.memberService.member()?.city || '',
      country: this.memberService.member()?.country || '',
    }

     this.isInitialized = true;


    this.route.parent?.data.subscribe(data => {
      this.member.set(data['member']);
    })
  }

    updateProfile() {

    if (!this.memberService.member()) return;
    const updatedMember = { ...this.memberService.member(), ...this.editableMember }
    this.memberService.updateMember(this.editableMember).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser && updatedMember.displayName !== currentUser?.displayName) {
          currentUser.displayName = updatedMember.displayName;
          this.accountService.setCurrentUser(currentUser);
        }
        this.toast.success('Profile updated successfully');
        this.memberService.editMode.set(false);
        this.memberService.member.set(updatedMember as Member);
        this.editForm?.reset(updatedMember);
      }
    })

  }

    ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false);
    }
  }




}
