export const API_TEST_GROUPS = {
  paro: [
    'modularni-urad-paro-api/test/suites/call_t', 
    'modularni-urad-paro-api/test/suites/project_t', 
    'modularni-urad-paro-api/test/suites/support_t'
  ],
  energoman: [
    'modularni-urad-energo-man/test/suites/points', 
    'modularni-urad-energo-man/test/suites/state'
  ],
  contactforms: [ 'contactform-api/test/suites/questions_t' ],
  mediaman: [ 'modularni-urad-mediaman/test/suites/files_t' ],
  ankety: [
    'modularni-urad-ankety-api/test/suites/survey_t', 
    'modularni-urad-ankety-api/test/suites/voting_t' 
  ]
}

export const OBSOLETE = {
  taskman: [
    '1_tasks',
    '2_comments',
    '3_solvers'
  ],
  projekty: [
    'projects'
  ],
  userman: [ 'users' ],
  groupman: [ 'groups', 'mships' ],
  notifyer: [ 'messages_t' ],
  optionman: [ 'groups_t', 'options_t' ],
  uni: [ 'posts_t' ]
}