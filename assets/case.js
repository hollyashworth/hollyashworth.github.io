/* Facts shared by every room of the main case and by the home page.
   Keep these in step with book/BIBLE.md. Nothing here may point at the culprit. */
window.CM_CASE = {
  suspects: [
    { id:'nora',   name:'Nora Crane',            role:"Edmund's niece",           color:'#7a3a5a', fact:'Runs the shop counter and lives in the flat above the toy shop. Fond of sweets.' },
    { id:'felix',  name:'Felix Marlow',          role:'A rival toymaker',          color:'#2f4f6b', fact:'Comes from Hartwell, the next town. Staying in Room 3 at the Holly Bush Inn.' },
    { id:'agnes',  name:'Agnes Pell',            role:"Edmund's housekeeper",      color:'#7c5a2f', fact:'Has kept house for him for 30 years. Makes his cocoa every night.' },
    { id:'greer',  name:'Reverend Tobias Greer', role:'The vicar',                 color:'#3e4a3a', fact:'The vicar of St Nicholas. Edmund refused to pay for the church roof.' },
    { id:'clara',  name:'Clara Wren',            role:'The choir leader',          color:'#5a3a7a', fact:'Leads the village choir, which sang at the lights switch-on.' },
    { id:'jasper', name:'Jasper Lowe',           role:"Edmund's apprentice",       color:'#6b3a22', fact:'Aged 19. Works in the workshop and sings tenor in the choir.' },
  ],
  // code, short label, name, nights (as printed in the book)
  rooms: [
    { code:'r0', n:'Practice', name:'The Study at Penrose House', nights:'Night 0, the practice case' },
    { code:'r1', n:'Room 1', name:'The Workshop', nights:'Nights 3, 4, 8, 17 and 23' },
    { code:'r2', n:'Room 2', name:"Felix's Room at the Holly Bush Inn", nights:'Night 6' },
    { code:'r3', n:'Room 3', name:"Nora's Flat", nights:'Night 7' },
    { code:'r4', n:'Room 4', name:'The Kitchen', nights:'Nights 9 and 19' },
    { code:'r5', n:'Room 5', name:'The Church Hall', nights:'Nights 11 and 13' },
    { code:'r6', n:'Room 6', name:"Jasper's Attic", nights:'Nights 14 and 15' },
    { code:'r7', n:'Room 7', name:'The Vestry', nights:'Nights 10 and 20' },
    { code:'r8', n:'Room 8', name:'The Yard and the Churchyard Path', nights:'Night 21' },
    { code:'r9', n:'Room 9', name:'The Green on Christmas Eve', nights:'Night 24' },
  ],
};
