(function(){
'use strict';
const paper='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 470" preserveAspectRatio="xMidYMid slice">'
+'<rect width="1000" height="470" fill="#d9cbb1"/>'
+'<path d="M0 290H1000V470H0Z" fill="#987b58"/>'
+'<rect x="60" y="35" width="275" height="245" fill="#705847"/>'
+'<rect x="79" y="57" width="235" height="198" fill="#a99576"/>'
+'<path d="M95 72V248M138 72V248M181 72V248M224 72V248M267 72V248" stroke="#5d5040" stroke-width="11"/>'
+'<path d="M657 21H684V304H657Z" fill="#574839"/><path d="M838 21H865V304H838Z" fill="#574839"/>'
+'<path d="M618 17H915V55H618Z" fill="#806043"/>'
+'<path d="M648 300H884V337H648Z" fill="#6f5444"/>'
+'<path d="M370 288L673 276L714 410L332 425Z" fill="#fff6de" stroke="#a5906d" stroke-width="3"/>'
+'</svg>';
const origin=window.UPPDRAG_CH1_CLOSEUPS?.images||{};
window.UPPDRAG_CH3_CLOSEUPS={
 images:{cafe:origin.cafe||paper,riksdag:origin.riksdag||paper,quay:origin.quay||paper,print:paper,archive:origin.cafe||paper},
 decorate(...args){return window.UPPDRAG_CH1_CLOSEUPS?.decorate?.(...args);}
};
})();