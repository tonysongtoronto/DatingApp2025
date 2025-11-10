import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { Member } from '../../../types/member';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/services/account-service';
import { MemberService } from '../../../core/services/member-service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css'
})
export class MemberDetailed implements OnInit {
  private route = inject(ActivatedRoute);
    protected memberService = inject(MemberService);
  private router = inject(Router);
    private accountService = inject(AccountService);
  protected member = signal<Member | undefined>(undefined);
  protected title = signal<string | undefined>('Profile');

private routeId = toSignal(
  this.route.paramMap.pipe(map(p => p.get('id')))
);

protected isCurrentUser = computed(() => {
  return this.accountService.currentUser()?.id === this.routeId();
});

  constructor() {
    // 使用 effect 自动同步 memberService.member() 的变化
    effect(() => {
      const serviceMember = this.memberService.member();
      // 只有当 service 中有数据，且与当前路由 ID 匹配时才同步
      if (serviceMember ) {
        this.member.set(serviceMember);
      }
    });
  }


  ngOnInit(): void {

    this.route.data.subscribe({
      next: data => {
        this.member.set(data['member'])
      }

    });


    this.title.set(this.route.firstChild?.snapshot?.title);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next: () => {
       this.title.set(this.route.firstChild?.snapshot?.title)
      }
    })
  }
}
