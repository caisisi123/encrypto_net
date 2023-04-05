
     function preLoadScript(src){
          window.addEventListener('DOMContentLoaded',()=>{
              const script=document.createElement('script');
              script.src=src;
              script.async=true;
              document.head.appendChild(script);
        })
    }
    //options为其他对link标签属性的定制
    function  prefetchAsset(src, {crossOrigin}){
          window.requestIdleCallback(()=>{
              const link=document.createElement('link');
              link.href=src;
              link.rel='prefetch';
              const url=new URL(src,import.meta.url)
              console.log(url.host);
              if(url.host!==document.location.host){
                  link.crossOrigin=crossOrigin||'use-credentials';
              }
            const ext=src.split('.').pop()
              switch (ext){
                  case 'css':
                      link.as='style';
                      break;
                  case 'png'||'jpeg'||'webp'||'png':
                      link.as='image'
                      break;
                  default:
                      link.as='fetch'
              }
              document.head.appendChild(link)
          })
    }

    //不管布局，只预加载看到的，懒加载未显示的，rows,cols,srcArray,rowHeight
     //滚动加载
     function scrollLoad(containerSelector,offset,delay,options){
         return new Promise((resolve,reject)=>{
             const container=document.querySelector(containerSelector);
             function debounce(fn){
                 let timer=null;
                 return function (){
                     clearTimeout(timer);
                     timer=setTimeout(fn,delay)
                 }
             }
             function throttle(fn,delay){
                 let timer=null;
                 return function (){
                     const thisArg=this;
                     const args=arguments;
                     if(!timer){
                         timer=setTimeout(()=> {
                             timer=null
                             fn.apply(thisArg, args)
                         },delay)
                     }
                 }
             }
             container.addEventListener('scroll',debounce(function (){
                 const {scrollTop,offsetHeight,scrollHeight}=div;
                 if(scrollTop+offsetHeight>scrollHeight-offset){
                     resolve(true)
                 }
             }))
         })

     }


  export {prefetchAsset,preLoadScript,scrollLoad}