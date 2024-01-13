/**
 * Global variable
 */
const currentDate: Date = new Date();
const elmTitle: HTMLElement = document.querySelector('#js-cal-title')!;
const elmPrev: HTMLElement = document.querySelector('#js-cal-prev')!;
const elmNext: HTMLElement = document.querySelector('#js-cal-next')!;
const elmDays: HTMLElement = document.querySelector('#js-cal-days')!;
const cellClass: string = 'cal__day';
const cellPrevClass: string = `${cellClass}--prev`;
const cellNextClass: string = `${cellClass}--next`;
const cellSatClass: string = `${cellClass}--sat`;
const cellSunClass: string = `${cellClass}--sun`;

/**
 * Event handler
 */
// init App
const onPageLoad = (): void => {
	// Set current date
	updateView(currentDate);
}

// Move prev
const onPrev = (): void => {
	currentDate.setMonth(currentDate.getMonth() - 1);
	updateView(currentDate);
}

// Move next
const onNext = (): void => {
	currentDate.setMonth(currentDate.getMonth() + 1);
	updateView(currentDate);
}

/**
 * Event listener
 */
// Load page
window.addEventListener('load', onPageLoad);
// Click prev btn
elmPrev.addEventListener('click', onPrev);
// Click next btn
elmNext.addEventListener('click', onNext);

/**
 * Functions
 */
function updateView(date: Date): void {
	updateTitle(date);
	updateDays(date);
}

function updateTitle(date: Date): void {
	const year: string = date.getFullYear().toString();
	const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
	elmTitle.innerHTML = `${year}年${month}月`;
}

function updateDays(date): void {
	// セルの日付を格納する配列
	const dateList: number[] = [];
	// セルのclass名を格納する配列
	const classList: string[] = [];

  	// 日付の表示に必要な情報を求める
  	// 当月の日数を求める
	const thisDays: number = getMonthDays(date);
	// 当月の1日より左側に表示する日数を求める
	const prevDays: number = getFirstDayOfWeek(date);
	// 前月の末日を求める
	const prevLastDate: number = getPrevMonthDays(date);
	// 当月の表示に必要な行数を求める
	const rows: number = Math.ceil((thisDays + prevDays) / 7);
	// HTML生成
	for (let i: number = 0; i < rows * 7; i++) {
		// 前月の場合
		if(i < prevDays) {
			dateList.push(prevLastDate - prevDays + 1 + i);
			classList.push(`${cellClass} ${cellPrevClass}`);
		// 当月の場合
		} else if(prevDays <= i && i < prevDays + thisDays) {
			dateList.push(i - prevDays + 1);
			if(i % 7 === 0) {
				classList.push(`${cellClass} ${cellSunClass}`);
			} else if(i % 7 === 6) {
				classList.push(`${cellClass} ${cellSatClass}`);
			} else {
				classList.push(cellClass);
			}
		// 翌月の場合
		} else {
			dateList.push(i - (prevDays + thisDays) + 1);
			classList.push(`${cellClass} ${cellNextClass}`);
		}
	}
	// HTML描画
	let html: string = '';
	for(let i: number = 0; i < rows * 7; i++) {
		// trタグ開始
		if(i % 7 === 0) {
			html += '<tr>';
		}
		html += `<td class="${classList.shift()}">${dateList.shift()?.toString()}</td>`;
		// セルが7番目の場合閉じる
		if(i % 7 === 6) {
			html += '</tr>';
		}
	}
	elmDays.innerHTML = html;
}

/**
 * 当月の日数
 */
function getMonthDays(date: Date): number {
	// 新規Dateインスタンス作成
	const lastDay: Date = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate()
	);
	// 翌月
	lastDay.setMonth(lastDay.getMonth() + 1);
	// 翌月から1日戻って当月の最終日を取り出し
	lastDay.setDate(0);
	// 日数を取得
	const days: number = lastDay.getDate();
	return days;
}

/**
 * 当月の曜日を取得
 */
function getFirstDayOfWeek(date: Date): number {
	const firstDay: Date = new Date(
		date.getFullYear(),
		date.getMonth(),
		1,
	);
	const day: number = firstDay.getDay();
	return day;
}

/**
 * 前月の日数を取得
 */
function getPrevMonthDays(date: Date): number {
	const prevMonth: Date = new Date(
		date.getFullYear(),
		date.getMonth() - 1);
	const days: number = getMonthDays(prevMonth);
	return days;
}
