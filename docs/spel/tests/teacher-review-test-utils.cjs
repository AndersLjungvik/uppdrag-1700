const {createHash}=require('node:crypto');
// Local QA substitutes a digest for a known fixture code. With an explicitly
// supplied classroom code the published module is exercised without rewriting.
async function installTeacherCode(page){
 if(process.env.GAME_TEACHER_CODE)return process.env.GAME_TEACHER_CODE;
 const code='547239';
 await page.route('**/teacher-review.js*',async route=>{
  const response=await route.fetch(),source=await response.text();
  const salt=JSON.parse(source.match(/const salt=("[^"]+")/)[1]);
  const digest=createHash('sha256').update(salt+':'+code).digest('hex');
  await route.fulfill({response,body:source.replace(/digest="[a-f0-9]{64}"/,'digest="'+digest+'"')});
 });
 return code;
}
module.exports={installTeacherCode};
