const restaurants = [
  {
    name: "소담한상",
    region: "강남",
    category: "한식",
    rating: 4.7,
    menu: ["제육볶음", "된장찌개", "비빔밥"],
  },
  {
    name: "오하요스시",
    region: "홍대",
    category: "일식",
    rating: 4.6,
    menu: ["초밥", "사케동", "우동"],
  },
  {
    name: "파스타노트",
    region: "성수",
    category: "양식",
    rating: 4.4,
    menu: ["알리오올리오", "라자냐", "리조또"],
  },
  {
    name: "루이중화",
    region: "을지로",
    category: "중식",
    rating: 4.3,
    menu: ["마라탕", "짜장면", "유린기"],
  },
  {
    name: "달콤공방",
    region: "잠실",
    category: "디저트",
    rating: 4.8,
    menu: ["크로플", "티라미수", "라떼"],
  },
  {
    name: "한강면옥",
    region: "강남",
    category: "한식",
    rating: 4.2,
    menu: ["냉면", "불고기", "만두"],
  },
];

const keywordInput = document.getElementById("keyword");
const regionSelect = document.getElementById("region");
const categorySelect = document.getElementById("category");
const minRatingSelect = document.getElementById("minRating");
const searchButton = document.getElementById("searchButton");
const recommendButton = document.getElementById("recommendButton");
const restaurantList = document.getElementById("restaurantList");
const resultsInfo = document.getElementById("resultsInfo");

const renderRestaurants = (items, message) => {
  restaurantList.innerHTML = "";

  if (items.length === 0) {
    restaurantList.innerHTML = '<li class="empty">조건에 맞는 맛집이 없습니다.</li>';
    resultsInfo.textContent = message ?? "검색 결과 0건";
    return;
  }

  items.forEach((restaurant) => {
    const listItem = document.createElement("li");
    listItem.className = "card";
    listItem.innerHTML = `
      <h3>${restaurant.name}</h3>
      <div class="meta">
        <span class="badge">${restaurant.region}</span>
        <span class="badge">${restaurant.category}</span>
        <span>⭐ ${restaurant.rating.toFixed(1)}</span>
      </div>
      <p>대표 메뉴: ${restaurant.menu.join(", ")}</p>
    `;
    restaurantList.appendChild(listItem);
  });

  resultsInfo.textContent = message ?? `검색 결과 ${items.length}건`;
};

const filterRestaurants = () => {
  const keyword = keywordInput.value.trim().toLowerCase();
  const region = regionSelect.value;
  const category = categorySelect.value;
  const minRating = Number(minRatingSelect.value);

  return restaurants.filter((restaurant) => {
    const nameOrMenu = `${restaurant.name} ${restaurant.menu.join(" ")}`.toLowerCase();
    const isKeywordMatch = keyword === "" || nameOrMenu.includes(keyword);
    const isRegionMatch = region === "all" || restaurant.region === region;
    const isCategoryMatch = category === "all" || restaurant.category === category;
    const isRatingMatch = restaurant.rating >= minRating;

    return isKeywordMatch && isRegionMatch && isCategoryMatch && isRatingMatch;
  });
};

searchButton.addEventListener("click", () => {
  const filtered = filterRestaurants();
  renderRestaurants(filtered);
});

recommendButton.addEventListener("click", () => {
  const filtered = filterRestaurants();

  if (filtered.length === 0) {
    renderRestaurants([], "추천 가능한 맛집이 없습니다. 조건을 완화해 보세요.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const recommendation = filtered[randomIndex];
  renderRestaurants([recommendation], `오늘의 추천: ${recommendation.name}`);
});

renderRestaurants(restaurants, "전체 맛집 목록");
