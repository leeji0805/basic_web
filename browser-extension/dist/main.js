(()=>{const e=document.querySelector(".form-data"),t=document.querySelector(".region-name"),o=document.querySelector(".api-key"),l=document.querySelector(".errors"),n=document.querySelector(".loading"),a=document.querySelector(".result"),r=(document.querySelector(".carbon-usage"),document.querySelector(".fossil-fuel"),document.querySelector(".my-region"),document.querySelector(".clear-btn"));function c(){const t=localStorage.getItem("apiKey"),o=localStorage.getItem("regionName");null===t||null===o?(e.style.display="block",a.style.display="none",n.style.display="none",r.style.display="none",l.textContent=""):(displayCarbonUsage(t,o),a.style.display="none",e.style.display="none",r.style.display="block")}e.addEventListener("submit",(e=>function(e){e.preventDefault(),function(e,t){localStorage.setItem("apiKey",e),localStorage.setItem("regionName",t),n.style.display="block",l.textContent="",r.style.display="block",displayCarbonUsage(e,t)}(o.value,t.value)}(e))),r.addEventListener("click",(e=>function(e){e.preventDefault(),localStorage.removeItem("regionName"),c()}(e))),c()})();