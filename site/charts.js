'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const fmt=(v,d=0)=>Number(v).toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d});
const money=v=>'$'+fmt(v,0);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const med=a=>{a=[...a].sort((a,b)=>a-b);const n=a.length;return n?(a[Math.floor(n/2)]+a[Math.floor((n-1)/2)])/2:null};
function options(el,values,all){el.innerHTML=(all?`<option value="">${esc(all)}</option>`:'')+values.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('')}
function svgChart(host,content,w=700,h=350,label='Chart'){host.innerHTML=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">${content}</svg>`}
function bars(host,rows,{percent=false,moneyUnit=false,max=null}={}){const ceiling=max||Math.max(...rows.map(r=>r.value),1);host.innerHTML=rows.map(r=>`<div class="metric-bar"><span>${esc(r.name)}</span><div class="track"><div class="fill" style="width:${Math.max(0,Math.min(100,r.value/ceiling*100))}%;${r.color?'background:'+r.color:''}"></div></div><strong>${moneyUnit?money(r.value):fmt(r.value,percent?1:0)+(percent?'%':'')}</strong></div>`).join('')}
function downloadCSV(name,rows){if(!rows.length)return;const keys=Object.keys(rows[0]);const q=v=>'"'+String(v??'').replaceAll('"','""')+'"';const csv=[keys.map(q).join(','),...rows.map(r=>keys.map(k=>q(r[k])).join(','))].join('\n');const u=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
