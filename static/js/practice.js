var mEntries=[]
var root=document.getElementsByClassName("entries")[0]
var bitFlip=0
function joinItem(item){if(typeof(item)=="object"){return item.join(" / ")}
return item}
function buildEntries(){var mEntries=[]
entries.sort((a,b)=>{if(typeof(a)=="object"){a=a[bitFlip]}
if(typeof(b)=="object"){b=b[bitFlip]}
if(a[0].toLowerCase()>b[0].toLowerCase()){return 1}
if(b[0].toLowerCase()>a[0].toLowerCase()){return-1}
return 0})
for(let entry of entries){mEntries.push(m("article",{class:"entry"},[m("span",{class:"from-language"},joinItem(entry[bitFlip?1:0])+": "),m("span",{class:"to-language"},joinItem(entry[bitFlip?0:1]))]))}
return mEntries}
var flipDictionary=function(){m.render(root,buildEntries())
bitFlip^=1}
flipDictionary()
document.getElementsByClassName("reverse-button")[0].onclick=flipDictionary
Array.from(document.getElementsByClassName("eye-button")).forEach(function(element){element.addEventListener("click",()=>{document.getElementsByClassName("eye-closed-button")[0].classList.toggle("hide")
document.getElementsByClassName("eye-open-button")[0].classList.toggle("hide")
Array.from(document.getElementsByClassName("to-language")).forEach(function(element){console.log(element)
element.classList.toggle("invisible")})})})