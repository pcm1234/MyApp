const STORAGE_KEY = "pingpong_members";

const form = document.getElementById("member-form");
const memberIdInput = document.getElementById("member-id");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const gradeInput = document.getElementById("grade");
const visitInput = document.getElementById("visit");
const joinedAtInput = document.getElementById("joinedAt");
const cancelEditBtn = document.getElementById("cancel-edit");
const saveBtn = document.getElementById("save-btn");

const searchInput = document.getElementById("search");
const gradeFilter = document.getElementById("grade-filter");
const statsElement = document.getElementById("stats");
const tableWrapper = document.getElementById("table-wrapper");

let members = loadMembers();

setDefaultDate();
render();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const member = {
    id: memberIdInput.value || crypto.randomUUID(),
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    grade: gradeInput.value,
    visit: Number(visitInput.value) || 0,
    joinedAt: joinedAtInput.value,
  };

  if (!member.name || !member.phone || !member.joinedAt) {
    alert("이름, 연락처, 등록일은 필수입니다.");
    return;
  }

  const existingIndex = members.findIndex((item) => item.id === member.id);

  if (existingIndex >= 0) {
    members[existingIndex] = member;
  } else {
    members.push(member);
  }

  saveMembers();
  resetForm();
  render();
});

cancelEditBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", render);
gradeFilter.addEventListener("change", render);

tableWrapper.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "edit") {
    startEdit(id);
  }

  if (action === "delete") {
    const confirmed = window.confirm("선택한 회원을 삭제하시겠습니까?");
    if (!confirmed) return;

    members = members.filter((item) => item.id !== id);
    saveMembers();
    render();
  }
});

function setDefaultDate() {
  if (!joinedAtInput.value) {
    joinedAtInput.valueAsDate = new Date();
  }
}

function startEdit(id) {
  const member = members.find((item) => item.id === id);
  if (!member) return;

  memberIdInput.value = member.id;
  nameInput.value = member.name;
  phoneInput.value = member.phone;
  gradeInput.value = member.grade;
  visitInput.value = member.visit;
  joinedAtInput.value = member.joinedAt;

  cancelEditBtn.classList.remove("hidden");
  saveBtn.textContent = "회원 수정";
}

function resetForm() {
  memberIdInput.value = "";
  form.reset();
  setDefaultDate();
  cancelEditBtn.classList.add("hidden");
  saveBtn.textContent = "회원 등록";
}

function render() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedGrade = gradeFilter.value;

  const filteredMembers = members.filter((member) => {
    const matchedKeyword =
      member.name.toLowerCase().includes(keyword) ||
      member.phone.toLowerCase().includes(keyword);

    const matchedGrade = selectedGrade === "all" || member.grade === selectedGrade;

    return matchedKeyword && matchedGrade;
  });

  renderStats(filteredMembers);
  renderTable(filteredMembers);
}

function renderStats(list) {
  const total = list.length;
  const visits = list.reduce((sum, member) => sum + (Number(member.visit) || 0), 0);
  const avgVisit = total ? (visits / total).toFixed(1) : "0.0";

  const levelMap = list.reduce(
    (acc, member) => {
      acc[member.grade] += 1;
      return acc;
    },
    { 초급: 0, 중급: 0, 상급: 0 }
  );

  statsElement.innerHTML = `
    <span class="pill">총 회원: ${total}명</span>
    <span class="pill">월 방문 합계: ${visits}회</span>
    <span class="pill">평균 방문: ${avgVisit}회</span>
    <span class="pill">초급: ${levelMap["초급"]}명 / 중급: ${levelMap["중급"]}명 / 상급: ${levelMap["상급"]}명</span>
  `;
}

function renderTable(list) {
  if (!list.length) {
    tableWrapper.innerHTML = '<div class="empty">조회된 회원이 없습니다.</div>';
    return;
  }

  const rows = list
    .slice()
    .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt))
    .map(
      (member, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(member.name)}</td>
        <td>${escapeHtml(member.phone)}</td>
        <td>${member.grade}</td>
        <td>${member.visit}</td>
        <td>${member.joinedAt}</td>
        <td>
          <button class="warning" data-action="edit" data-id="${member.id}">수정</button>
          <button class="danger" data-action="delete" data-id="${member.id}">삭제</button>
        </td>
      </tr>`
    )
    .join("");

  tableWrapper.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>이름</th>
          <th>연락처</th>
          <th>등급</th>
          <th>월 방문</th>
          <th>등록일</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function loadMembers() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMembers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
