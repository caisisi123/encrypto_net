
function fetchAxios(requestInterceptionObj,responseInterceptionObj){
   return new Proxy(fetch,{
       apply(target, thisArg, argArray) {
            if(requestInterceptionObj.request){
                requestInterceptionObj.request.apply(thisArg,argArray)
            }
            return target(...argArray).then((res)=>{
                if(res.status>=200&&res.status<300){
                    if(responseInterceptionObj.response)
                        responseInterceptionObj.response.apply(thisArg,res)
                }else{
                    if(responseInterceptionObj.error)
                        responseInterceptionObj.error(thisArg,res)
                }
            }).catch((error)=>{
                if(requestInterceptionObj.error)
                    requestInterceptionObj.error(error)
            });
        }
    })
}

class Axios{
   static #responseInterceptionObj={};
   static #requestInterceptionObj={};
   static mFetch(url,options){
     return fetchAxios(this.#requestInterceptionObj,this.#responseInterceptionObj)(url,options)
   }
   static get(url,options){
       return this.mFetch(url,Object.assign({method:'GET'},options))
   }
   static post(url,options){
       return this.mFetch(url,Object.assign({method:'POST'},options))
   }
    static put(url,options){
        return this.mFetch(url,Object.assign({method:'PUT'},options))
    }
    static delete(url,options){
        return this.mFetch(url,Object.assign({method:'DELETE'},options))
    }
    static patch(url,options){
        return this.mFetch(url,Object.assign({method:'PATCH'},options))
    }
    static options(url,options){
        return this.mFetch(url,Object.assign({method:'OPTIONS'},options))
    }
    static head(url,options){
        return this.mFetch(url,Object.assign({method:'HEAD'},options))
    }
    static trace(url,options){
        return this.mFetch(url,Object.assign({method:'TRACE'},options))
    }
    static connect(url,options){
        return this.mFetch(url,Object.assign({method:'CONNECT'},options))
    }
   static requestInterception(dealConfig,dealError){
       this.#requestInterceptionObj.request=dealConfig;
       this.#requestInterceptionObj.error=dealError
   }
   static responseInterception(dealResponse,dealError){
       this.#responseInterceptionObj.response=dealResponse;
       this.#responseInterceptionObj.error=dealError
   }
}
export {Axios}