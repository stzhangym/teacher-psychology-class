let students = [];
let currentUser = null;
let scores = {};
let answersCount = {A:0,B:0,C:0,D:0};

const stages = [
    "第一阶段：认知觉察",
    "第二阶段：情绪理解",
    "第三阶段：价值澄清",
    "第四阶段：角色认同",
    "第五阶段：职业内化"
];

let currentStage = 0;

function showTeacher(){
    document.getElementById("teacherPanel").classList.remove("hidden");
    document.getElementById("studentPanel").classList.add("hidden");
}

function showStudent(){
    document.getElementById("studentPanel").classList.remove("hidden");
    document.getElementById("teacherPanel").classList.add("hidden");
}

function joinClass(){
    let name = document.getElementById("studentName").value;
    if(!name) return alert("请输入姓名");
    currentUser = name;
    if(!students.includes(name)){
        students.push(name);
        scores[name] = 0;
    }
    document.getElementById("login").classList.add("hidden");
    loadStage();
}

function loadStage(){
    document.getElementById("stageTitle").innerText = stages[currentStage];
    document.getElementById("questionArea").innerText = "你认为教师最重要的品质是？";
    document.getElementById("options").innerHTML = `
        <button onclick="answer('A')">责任</button>
        <button onclick="answer('B')">共情</button>
        <button onclick="answer('C')">专业</button>
        <button onclick="answer('D')">创新</button>
    `;
}

function answer(option){
    answersCount[option]++;
    scores[currentUser] += 10;
    document.getElementById("score").innerText = scores[currentUser];
    showAchievement();
    updateChart();
    updateRanking();
}

function showAchievement(){
    let ach = document.getElementById("achievement");
    ach.classList.remove("hidden");
    setTimeout(()=>ach.classList.add("hidden"),1000);
}

function updateChart(){
    if(window.myChart) window.myChart.destroy();
    let ctx = document.getElementById('chart');
    window.myChart = new Chart(ctx,{
        type:'bar',
        data:{
            labels:['A','B','C','D'],
            datasets:[{
                label:'选择比例',
                data:Object.values(answersCount)
            }]
        }
    });
}

function updateRanking(){
    let ranking = document.getElementById("ranking");
    ranking.innerHTML = "";
    let sorted = Object.entries(scores).sort((a,b)=>b[1]-a[1]);
    sorted.forEach(s=>{
        ranking.innerHTML += `<li>${s[0]} - ${s[1]}分</li>`;
    });
}

function exportExcel(){
    let data = [["姓名","积分"]];
    Object.entries(scores).forEach(s=>{
        data.push([s[0],s[1]]);
    });
    let ws = XLSX.utils.aoa_to_sheet(data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "课堂报告");
    XLSX.writeFile(wb,"课堂数据.xlsx");
}
