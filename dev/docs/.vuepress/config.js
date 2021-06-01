
module.exports = {
    title: 'Kaye',
    description: 'loading',//网站描述
    base:'/MyVuePressBlog/',
    themeConfig: {
        subSidebar: 'auto',
        author: 'Kaye',
        type: "blog",
        head: [
            ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
            ['link', { rel: 'icon', href: '/logo.png' }]
          ],
        nav: [//导航栏
            { 'text': 'TimeLine', 'link': '/timeline/', 'icon': 'reco-date' },
            { 'text': 'Contact' , 'icon':'reco-message' , 'items':[
                {
                    "text": "CodePan",
                    "link": "https://codepen.io/KayeLau",
                    "icon": "reco-github"
                },
                {
                    "text": "GitHub",
                    "link": "https://github.com/kayeLau",
                    "icon": "reco-github"
                },
                {
                    "text": "Leetcode",
                    "link": "https://leetcode-cn.com/u/kayeung/",
                    "icon": "reco-github"
                }
            ]}
        ],
        blogConfig: {
            category: {
              location: 2, // 在导航栏菜单中所占的位置，默认2
              text: 'Category' // 默认 “分类”
            },
            tag: {
              location: 3, // 在导航栏菜单中所占的位置，默认3
              text: 'Blog' // 默认 “标签”
            }
          },
    },
    theme:'reco'
}