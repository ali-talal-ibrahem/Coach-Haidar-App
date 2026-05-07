// إعداد التاريخ الافتراضي
if (!document.getElementById('currentDate').value) {
    document.getElementById('currentDate').valueAsDate = new Date();
}

let dayCount = 0;
const accentColors = ['border-accent-0', 'border-accent-1', 'border-accent-2', 'border-accent-3', 'border-accent-4'];

// --- وظائف الحفظ التلقائي (Draft System) ---

function saveDraft() {
    const playerName = document.getElementById('playerName').value;
    const programDate = document.getElementById('currentDate').value;
    const sections = [];

    document.querySelectorAll('.coach-card').forEach((card, index) => {
        const sectionTitle = card.querySelector('.section-title-input').value;
        const exercises = [];
        card.querySelectorAll('.exercise-item').forEach(ex => {
            exercises.push({
                name: ex.querySelector('.ex-name-input').value,
                rounds: ex.querySelectorAll('input[type="number"]')[0].value,
                reps: ex.querySelectorAll('input[type="number"]')[1].value
            });
        });
        sections.push({ title: sectionTitle, exercises: exercises });
    });

    const draft = { player: playerName, date: programDate, sections: sections };
    localStorage.setItem('coachHaidarDraft', JSON.stringify(draft));
}

function loadDraft() {
    const savedData = localStorage.getItem('coachHaidarDraft');
    if (!savedData) return;

    const draft = JSON.parse(savedData);
    document.getElementById('playerName').value = draft.player || '';
    document.getElementById('currentDate').value = draft.date || '';

    draft.sections.forEach((sec, sIdx) => {
        addDay(sec.title);
        sec.exercises.forEach(ex => {
            addExercise(sIdx + 1, ex.name, ex.rounds, ex.reps);
        });
    });
}

function clearAllData() {
    if (confirm("هل أنت متأكد من مسح كافة التمارين؟ لا يمكن التراجع!")) {
        localStorage.removeItem('coachHaidarDraft');
        location.reload();
    }
}

// --- وظائف الواجهة (UI Functions) ---

function addDay(title = "") {
    dayCount++;
    const dayId = `day-${dayCount}`;
    const colorClass = accentColors[(dayCount - 1) % accentColors.length];
    
    const dayHtml = `
        <div class="coach-card p-6 animate-card ${colorClass}" id="${dayId}">
            <button onclick="removeElement('${dayId}')" class="absolute top-5 left-5 text-slate-600 hover:text-red-500 transition-colors">
                <i class="fas fa-trash-alt text-sm"></i>
            </button>

            <div class="flex items-center gap-3 mb-6">
                <div class="w-8 h-8 rounded-lg dynamic-bg flex items-center justify-center">
                    <i class="fas fa-dumbbell dynamic-text text-sm"></i>
                </div>
                <input type="text" oninput="saveDraft()" value="${title}" placeholder="عنوان القسم..." 
                    class="section-title-input bg-transparent font-black dynamic-text w-full border-none outline-none text-lg p-0 placeholder-slate-700 focus:ring-0">
            </div>

            <div id="ex-container-${dayCount}" class="space-y-4"></div>

            <button onclick="addExercise(${dayCount})" 
                class="mt-6 w-full py-3 bg-slate-800/40 text-slate-400 rounded-xl text-[11px] font-black border border-white/5 hover:dynamic-bg hover:dynamic-text transition-all uppercase">
                + إضافة تمرين جديد
            </button>
        </div>`;

    document.getElementById('daysContainer').insertAdjacentHTML('beforeend', dayHtml);
    saveDraft();
}

function addExercise(dayId, name = "", rounds = "", reps = "") {
    const container = document.getElementById(`ex-container-${dayId}`);
    const currentCount = container.querySelectorAll('.exercise-item').length + 1;
    const exId = `ex-${Date.now()}-${Math.random()}`;

    const exHtml = `
        <div class="exercise-item p-4 rounded-xl space-y-3 transition-all" id="${exId}">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <i class="fas fa-bolt dynamic-text text-[10px]"></i>
                    <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">تمرين ${currentCount}</span>
                </div>
                <button onclick="document.getElementById('${exId}').remove(); saveDraft();" class="text-slate-700 hover:text-red-400 transition-colors">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
            
            <input type="text" oninput="saveDraft()" value="${name}" placeholder="اسم التمرين..." 
                class="ex-name-input w-full bg-transparent text-sm font-bold border-none outline-none p-0 text-slate-200 placeholder-slate-700 focus:ring-0">
            
            <div class="grid grid-cols-2 gap-3 pt-1">
                <div class="space-y-1">
                    <span class="text-[8px] font-black text-slate-500 uppercase flex items-center gap-1">
                        <i class="fas fa-redo dynamic-text"></i> جولات
                    </span>
                    <input type="number" oninput="saveDraft()" value="${rounds}" placeholder="0" class="w-full rounded-lg p-2 text-center text-sm font-black outline-none focus:border-slate-500 transition-all bg-slate-900 border border-white/5">
                </div>
                <div class="space-y-1">
                    <span class="text-[8px] font-black text-slate-500 uppercase flex items-center gap-1">
                        <i class="fas fa-list-ol dynamic-text"></i> تكرار
                    </span>
                    <input type="number" oninput="saveDraft()" value="${reps}" placeholder="0" class="w-full rounded-lg p-2 text-center text-sm font-black outline-none focus:border-slate-500 transition-all bg-slate-900 border border-white/5">
                </div>
            </div>
        </div>`;

    container.insertAdjacentHTML('beforeend', exHtml);
    saveDraft();
}

function removeElement(id) {
    const el = document.getElementById(id);
    if (el) {
        el.remove();
        saveDraft();
    }
}

// تشغيل تحميل المسودة عند فتح الصفحة
window.onload = loadDraft;

// --- زر التحميل النهائي ---

const downloadBtn = document.getElementById('downloadBtn');
if (downloadBtn) {
    downloadBtn.onclick = function() {
        const playerName = document.getElementById('playerName').value || 'بطل كوتش حيدر';
        const programDate = document.getElementById('currentDate').value;
        const daysData = [];
        const cards = document.querySelectorAll('.coach-card');
        
        if (cards.length === 0) {
            alert("يرجى إضافة قسم تدريبي واحد على الأقل.");
            return;
        }

        cards.forEach((card, index) => {
            const sectionTitle = card.querySelector('.section-title-input').value || `قسم ${index + 1}`;
            const exercises = [];
            card.querySelectorAll('.exercise-item').forEach(ex => {
                exercises.push({
                    name: ex.querySelector('.ex-name-input').value || 'تمرين عام',
                    rounds: ex.querySelectorAll('input[type="number"]')[0].value || '0',
                    reps: ex.querySelectorAll('input[type="number"]')[1].value || '0'
                });
            });
            daysData.push({ title: sectionTitle, exercises: exercises });
        });

        localStorage.setItem('coachHaidarProgram', JSON.stringify({
            player: playerName,
            date: programDate,
            sections: daysData
        }));

        window.location.href = 'print.html';
    };

    if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(reg => {
        console.log('✅ تم تسجيل المحرك بنجاح في المسار:', reg.scope);
      })
      .catch(err => {
        console.error('❌ فشل التسجيل، تأكد من مسار الملف:', err);
      });
  });
}
}
