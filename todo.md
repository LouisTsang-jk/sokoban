- 寻找资源
    - player
    - map
    - box
    - point
- 


- Q&A
1. 如何限定人物走动
使用两份数据
一份数据保存整个场景内所有的坐标【player,box,wall,point】
2. 胜利条件
箱子每次移动，将判断自身是否在目标内，若在目标内则开始遍历其他箱子的位置。
3. 如何省略素材
直接用文字完事