(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{565:function(s,t,a){"use strict";a.r(t);var n=a(6),e=Object(n.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("p",[s._v("最近完成了一個小型的外包項目,在部署考慮了很多不同的平台,最後決定將項目掛在AWS上,井採用Nginx作為web server。")]),s._v(" "),a("h2",{attrs:{id:"aws服務"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#aws服務"}},[s._v("#")]),s._v(" AWS服務")]),s._v(" "),a("p",[s._v("這個項目是一家連鎖火鍋店的後台監控系統,主要是給運營使用的,對於流量與并發的要求并不高,因此我只選用了一台基礎VPS,服務器環境是ubuntu,開啟服務與SSH連接的教程可以看"),a("a",{attrs:{href:"https://www.youtube.com/watch?v=q45jGMRwRVo",target:"_blank",rel:"noopener noreferrer"}},[s._v("這裡"),a("OutboundLink")],1),s._v("。")]),s._v(" "),a("h2",{attrs:{id:"安裝nginx"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#安裝nginx"}},[s._v("#")]),s._v(" 安裝nginx")]),s._v(" "),a("p",[s._v("完成SSH連接後,首先要切換為root用戶")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" -s\n")])])]),a("p",[s._v("然後用以下命令安裝Nginx")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("apt")]),s._v(" update\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("apt")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" nginx\n")])])]),a("h2",{attrs:{id:"配置nginx"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#配置nginx"}},[s._v("#")]),s._v(" 配置nginx")]),s._v(" "),a("p",[s._v("若果要啟用防火牆,要留意防火墙有沒有對nginx服務與SSH連接進行封鎖(慘痛教訓:我就是把SSH連接牆掉,導致後面一直連不上。)")]),s._v(" "),a("p",[s._v("可以用以下指令設置防火牆")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" ufw allow "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'Nginx HTTP'")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#允許'Nginx HTTP'服務")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" ufw status "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#查詢防火牆情況")]),s._v("\n")])])]),a("p",[s._v("Ubuntu 20.04 上的 Nginx 默認啟用一個服務器塊，配置為/var/www/html,我們直接將項目放到這裡就可以。但如果你想在服務器上託管多個站點，就需要配置額外的Server Blocks。 詳細的配置可以參考"),a("a",{attrs:{href:"https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04",target:"_blank",rel:"noopener noreferrer"}},[s._v("這裡"),a("OutboundLink")],1),s._v("。")]),s._v(" "),a("h2",{attrs:{id:"測驗服務器"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#測驗服務器"}},[s._v("#")]),s._v(" 測驗服務器")]),s._v(" "),a("p",[s._v("在安装结束后，Ubuntu 会启动Nginx。 Web Server應該已经在运行了。我們可以查詢服務器的公網IP,并在瀏覽器打開http://your_IP。若果看到 Nginx 的默认页面,就说明服务器运行起来了。")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("curl")]),s._v(" -4 icanhazip.com "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#返回公網IP")]),s._v("\n")])])]),a("h2",{attrs:{id:"上存文件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#上存文件"}},[s._v("#")]),s._v(" 上存文件")]),s._v(" "),a("p",[s._v("從desktop上存文件到ubuntu可以用scp命令,scp是secure copy的縮寫,它的低層是SSH協議,默認22端口。使用scp傳輸數據時，文件和密碼都是加密的，不會泄漏敏感信息。在首次上存時需要提供密鑰,可以通過-i參數來指定。")]),s._v(" "),a("p",[s._v("基礎用法為:\n"),a("strong",[s._v("scp -i (你的密鑰的路徑) (你要傳輸的文件的路徑) (username@ip):(要復制的文件的路徑)")])]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("scp")]),s._v(" -i key.pem file.zip ubuntu@00.00.000.00:/home/ubuntu\n")])])]),a("h2",{attrs:{id:"文件操作"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#文件操作"}},[s._v("#")]),s._v(" 文件操作")]),s._v(" "),a("p",[s._v("我們上存的是zip檔案,需要把檔案移動到var/www/html路徑下并解壓縮。操作時留意用戶的權限,建議先切換到root。")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 移動檔案")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("mv")]),s._v(" 檔案路徑 目的路徑\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 解壓檔案")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("unzip")]),s._v(" 檔案路徑\n")])])]),a("h2",{attrs:{id:"重啟服務"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#重啟服務"}},[s._v("#")]),s._v(" 重啟服務")]),s._v(" "),a("h2",{attrs:{id:"配置代理"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#配置代理"}},[s._v("#")]),s._v(" 配置代理")])])}),[],!1,null,null,null);t.default=e.exports}}]);