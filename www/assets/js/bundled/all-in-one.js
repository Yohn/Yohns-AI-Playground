(()=>{function R(o){let a="";function t(e){if(Array.isArray(e))e.forEach(n=>t(n));else if(typeof e=="object")for(let n in e)t(e[n]);else a+=e+","}return t(o),a.slice(0,-1)}function $(o,a){let t=document.createElement("div"),e=document.createElement("div"),n=document.createElement("div"),l=document.createElement("div"),c=new Date,m=c.toLocaleString();return t.classList.add("d-flex"),e.classList.add("flex-shrink-0","text-center"),n.classList.add("text-secondary","border-top","border-secondary","text-right","fs-6"),n.innerHTML=m,o==="ai"?(l.classList.add("shadow","flex-grow-1","ms-3","border","rounded","p-2","mb-2","ai-chat","bg-body-tertiary"),e.classList.add("order-0"),e.innerHTML='<img src="/assets/svg/ai-6e9dd4.svg" alt="ai" style="max-width:75px; height:auto;">'):(l.classList.add("shadow","flex-grow-1","me-3","border","rounded","p-2","mb-2","user-chat","bg-secondary-subtle"),e.classList.add("order-1"),e.innerHTML='<img src="/assets/svg/me-639dd4.svg" alt="ai" style="max-width:75px; height:auto;">'),l.innerHTML=a,l.append(n),t.append(e),t.append(l),t}async function M(o,a){let t=[];return t.prompt=await H(o),t.model=await O(a),t}var C={};async function H(o){let t=(await fetch("assets/data/prompts.json")).json();return console.log("prompts"),console.log(t),Object.keys(t).forEach(e=>{let n=document.createElement("option");n.value=e,n.text=e,o.appendChild(n),C[e]=t[e]}),dselect(o),o}var P={};async function O(o){let t=await(await fetch("assets/data/models.json")).json();return console.log("models"),console.log(t),Object.keys(t).forEach(([e,n])=>{let l=document.createElement("option");l.value=e,l.text=n.name,l.setAttribute("data-dselect-img",n.img),o.appendChild(l),P[e]=t[e]}),dselect(o),o}document.addEventListener("DOMContentLoaded",function(){let o=document.getElementById("chat-form"),a=document.getElementById("chatMsg"),t=document.getElementById("resp"),e=document.getElementById("chat-box"),n=document.getElementById("loading-icon"),l=document.getElementById("sidePanel"),c=document.getElementById("settings-btn"),m=document.getElementById("to-do-list"),d=document.getElementById("to-do-btn"),g=document.getElementById("main-chat");o.addEventListener("submit",async s=>{s.preventDefault();let r=a.value;n.classList.remove("d-none");let i=marked.parse(r),v=$("user",i);e.insertBefore(v,t);let u=new FormData;u.append("hello","Yohn"),u.append("chatMsg",r);let I=Object.fromEntries(u);try{let p=await fetch("/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(I)});if(!p.ok)throw new Error("Network response was not ok.");a.value="";let T=new Event("input",{bubbles:!0});a.dispatchEvent(T);let w=await p.json();console.log(JSON.stringify(w));let B=marked.parse(w.aiResp),A=$("ai",B);e.insertBefore(A,t),e.querySelectorAll("pre code").forEach(k=>{hljs.highlightElement(k)}),n.classList.add("d-none")}catch(p){console.error("Error:",p)}});let b=document.getElementById("prompt-preset-select"),S=document.getElementById("model-preset-select");M(b,S),b.addEventListener("change",async s=>{systemPrompt.value=C[s.target.value]}),a.addEventListener("input",function(){this.style.height="auto";let s=Math.min(this.scrollHeight,window.innerHeight*.4);this.style.height=s+"px"}),Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]')).forEach(s=>{new bootstrap.Tooltip(s)});function h(s){let r=parseInt(g.getAttribute("data-yo-col")),i=s=="up"?r+3:r-3;g.classList.remove("col-"+r),g.classList.add("col-"+i),g.setAttribute("data-yo-col",i)}l.addEventListener("show.bs.collapse",s=>{c.classList.toggle("btn-primary"),c.classList.toggle("btn-outline-primary"),l.classList.toggle("font-zero"),h("down")}),l.addEventListener("hide.bs.collapse",s=>{c.classList.toggle("btn-primary"),c.classList.toggle("btn-outline-primary"),l.classList.toggle("font-zero"),h("up")}),m.addEventListener("show.bs.collapse",s=>{d.classList.toggle("btn-primary"),d.classList.toggle("btn-outline-primary"),d.classList.toggle("font-zero"),h("down")}),m.addEventListener("hide.bs.collapse",s=>{d.classList.toggle("btn-primary"),d.classList.toggle("btn-outline-primary"),d.classList.toggle("font-zero"),h("up")});document.getElementById("bgColor").addEventListener("input",function(){document.body.style.backgroundColor=this.value});let y=document.getElementById("gradientStart"),E=document.getElementById("gradientEnd"),L=document.getElementById("gradientOpacity");y.addEventListener("input",f),E.addEventListener("input",f),L.addEventListener("input",f);function f(){let s=y.value,r=E.value,i=L.value;document.body.style.backgroundImage=`linear-gradient(to right, ${x(s,i)}, ${x(r,i)})`}function x(s,r){let i=parseInt(s.slice(1,3),16),v=parseInt(s.slice(3,5),16),u=parseInt(s.slice(5,7),16);return`rgba(${i}, ${v}, ${u}, ${r})`}});})();
//!-------------------------------------------------------------------!
//!
//!------------------------------------------------------------------------!
//# sourceMappingURL=all-in-one.js.map
