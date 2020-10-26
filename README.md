![vuejs-wide](https://user-images.githubusercontent.com/8532735/97205758-d5b70d00-17f2-11eb-860f-ebe2f5f46641.png)

# Clone Tiktok frontend
  
## 目的
    1. 主要想使用Laravel 製作server ，並做一個簡易的clone tiktok project.
    2.  由前端Vuejs 製作SPA ,並和後端Laravel 進行Request(主要由RestAPI) .
    3. deploy on Google App Engine 並使用 Google Cloud SQL , Google Cloud Storage.

### **主要支援Mobile mode ,沒有RWD.
### **ios上無法於scroll post後 auto play 正在找方法。
    
   ## Demo video
[ DEMO Video on YT](https://youtu.be/wb_pEa6ka9Y)   
[ Backend Laravel on Github](https://github.com/SyunSie/cloneTiktok_back)   
[  Online DEMO Hosting on GAE](https://practice-clonetiktok.df.r.appspot.com/#/) **** 沒有RWD , 請用 MOBILE MODE****
   <hr>
   
  ## 1. 架構
![理想架構 clone tiktok (1)](https://user-images.githubusercontent.com/8532735/97197596-ccc13e00-17e8-11eb-9baf-4168eac9dfee.jpg)
    
主要用 Laravel + Vuejs 建置一個server deploy 在 google App Engine，當User 要求/存取 Posts斗資料 ，會經由AppEngine(Laravel) 存/取 GCS(Google Cloud SQL)，Post_Video 會經由Laravel 存在Cloud Storage。
當前端收到Response 後 ，render在vuejs web app，而video會對Cloud Storage 進行 加載.
  
  <hr>
    
    
    
    

2. 主要使用Vuejs 建立SPA , 主要用restful API 和backend(Laravel)發出Request,並依照Response進行render

    
