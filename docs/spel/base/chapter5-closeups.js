(function(){'use strict';
const previous=window.UPPDRAG_CH4_CLOSEUPS?.images||{};
const original=window.UPPDRAG_CH1_CLOSEUPS?.images||{};
window.UPPDRAG_CH5_CLOSEUPS={images:{
 cafe:previous.cafe||original.cafe,
 print:previous.print||original.print,
 church:previous.church||original.riksdag||previous.print,
 riksdag:original.riksdag||previous.church,
 palace:original.palace||previous.science,
 archive:previous.archive||original.cafe
},
 decorate(...args){return window.UPPDRAG_CH4_CLOSEUPS?.decorate?.(...args)
                   ||window.UPPDRAG_CH1_CLOSEUPS?.decorate?.(...args);}};
})();