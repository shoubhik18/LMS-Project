import { Component } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-learners-dashboard',
  templateUrl: './learners-dashboard.component.html',
  styleUrls: ['./learners-dashboard.component.css'],
})
export class LearnersDashboardComponent {
  constructor(private sanitizer: DomSanitizer) {}

  edit = faEdit;
  darrow = faAngleDown;
  role = localStorage.getItem('role');
  // isShowTopic = true;
  modules = [
    { name: 'HTML & CSS', isShowTopic: false },
    { name: 'HTML & CSS', isShowTopic: false },
    { name: 'HTML & CSS', isShowTopic: false },
    { name: 'HTML & CSS', isShowTopic: false },
    { name: 'HTML & CSS', isShowTopic: false },
    { name: 'HTML & CSS', isShowTopic: false },
    { name: 'HTML & CSS', isShowTopic: false },
    { name: 'HTML & CSS', isShowTopic: false },
    { name: 'HTML & CSS', isShowTopic: false },
    { name: 'HTML & CSS', isShowTopic: false },
  ];

  subtopics = [
    {
      name: '19 June 2023',
      video: 'https://www.youtube.com/embed/qz0aGYrrlhU?si=vRsgyREVzuyaMbGT',
    },
    {
      name: '20 June 2023',
      video: 'https://www.youtube.com/embed/yfoY53QXEnI?si=x1CrXRbDUBs4ECY8',
    },
    {
      name: '21 June 2023',
      video: 'https://www.youtube.com/embed/hlGoQC332VM?si=o6uDxO6BS0-41ZvD',
    },
    {
      name: '22 June 2023',
      video: 'https://www.youtube.com/embed/W6NZfCO5SIk?si=Ho1H-5cfdKm7NSoF',
    },
    {
      name: '23 June 2023',
      video: 'https://www.youtube.com/embed/0LhBvp8qpro?si=Lfp6lmhtC5hl3C5i',
    },
  ];

  tabStates: { [key: string]: boolean } = {
    courseInfo: true,
    resources: false,
    projects: false,
    resume: false,
    askAI: false,
  };

  expand(index: number) {
    this.modules[index].isShowTopic = !this.modules[index].isShowTopic;
  }

  style(tab: string) {
    return {
      color: this.tabStates[tab] ? 'black' : 'grey',
      'border-bottom': this.tabStates[tab]
        ? '2px solid #1f2937'
        : '2px #8f949b solid',
    };
  }

  active(tab: string) {
    Object.keys(this.tabStates).forEach((key) => (this.tabStates[key] = false));
    this.tabStates[tab] = true;
  }

  isShowVideo = false;
  selectedTopic: any;
  safeVideoUrl: SafeUrl | undefined;

  showVideo(subtopic: any) {
    this.isShowVideo = true;
    this.selectedTopic = subtopic;
    if (this.selectedTopic && this.selectedTopic.video) {
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.selectedTopic.video
      );
    }
  }
}

// getsubtopics(i: number) {
//   const subtopicsForModule = [];

//   // Ensure that the module index is valid
//   if (i >= 0 && i < this.modules.length) {
//     // Iterate over subtopics and add up to 5 subtopics to the array
//     for (let j = 0; j < this.subtopics.length; j++) {
//       // Calculate the subtopic index for the current module
//       const subtopicIndex = i * 5 + j;

//       // Ensure the subtopic index is within the subtopics array
//       if (subtopicIndex < this.subtopics.length) {
//         subtopicsForModule.push(this.subtopics[subtopicIndex]);
//       } else {
//         break; // Break the loop when there are no more subtopics
//       }
//     }
//   }

//   return subtopicsForModule;
// }
