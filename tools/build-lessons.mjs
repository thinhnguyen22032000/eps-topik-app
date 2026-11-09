// Sinh data/lessons/lesson-01..10.json + data/lessons/index.json
// Chạy: node tools/build-lessons.mjs   (từ thư mục eps-topik)
// Định dạng từ: "hàn|phiên âm bồi|nghĩa|field|câu ví dụ Hàn|nghĩa câu"
import fs from "node:fs";
import { DIALOGUES } from "./dialogues.mjs";
import { EXP } from "./expansions.mjs";

// Đoán từ loại khi dòng dữ liệu không ghi rõ (cột thứ 7 để ghi đè)
const ADJ = new Set(["비싸다", "싸다", "많다", "적다", "멀다", "가깝다", "높다", "덥다", "춥다", "맛있다", "아프다"]);
function guessPos(ko) {
  if (ADJ.has(ko)) return "Tính từ";
  if (/(하세요|니다|요)$/.test(ko) || ko.includes(" 뵙")) return "Cụm từ";
  if (ko.endsWith("다")) return "Động từ";
  return "Danh từ";
}

const L = [
  { ko: "인사와 소개", vi: "Chào hỏi và giới thiệu", topic: "greeting",
    words: `안녕하세요|an-nyong-ha-xê-yô|Xin chào|general|사장님, 안녕하세요?|Chào giám đốc ạ.
감사합니다|kam-sa-ham-ni-tà|Cảm ơn|general|도와주셔서 감사합니다.|Cảm ơn vì đã giúp đỡ.
사장님|sa-chang-nim|Giám đốc / chủ xưởng|general|사장님이 공장에 계십니다.|Giám đốc đang ở nhà máy.
직원|chik-uôn|Nhân viên|general|이 공장에는 직원이 열 명 있습니다.|Nhà máy này có mười nhân viên.
이름|i-rưm|Tên|general|이름이 뭐예요?|Tên bạn là gì?
공장|công-chang|Nhà máy, xưởng|manufacturing|저는 공장에서 일합니다.|Tôi làm việc ở nhà máy.
기계|ki-ghê|Máy móc|manufacturing|기계를 만지지 마세요.|Đừng chạm vào máy.
안전모|an-chon-mô|Mũ bảo hộ|safety|작업할 때 안전모를 쓰세요.|Khi làm việc hãy đội mũ bảo hộ.
용접|yông-chop|Hàn (kim loại)|construction|용접할 때 보안경을 쓰세요.|Khi hàn hãy đeo kính bảo hộ.
처음 뵙겠습니다|chơ-ưm buép-két-xưm-ni-tà|Rất vui được gặp lần đầu|general|처음 뵙겠습니다. 잘 부탁드립니다.|Rất vui được gặp, mong được giúp đỡ.`,
    grammar: [
      ["-입니다 / -입니까?", "Là… (trang trọng)", "Gắn sau danh từ để nói 'A là B'. Dạng trang trọng dùng với giám đốc, cấp trên.", "Danh từ + 입니다 / 입니까?", "저는 베트남 사람입니다.", "Tôi là người Việt Nam.", "이것은 기계입니까?", "Đây có phải là máy không?"],
      ["-은/는", "Trợ từ chủ đề", "Nêu chủ đề của câu (thường là 'tôi', 'cái này').", "Có patchim: 은 · Không patchim: 는", "저는 근로자입니다.", "Tôi là người lao động.", "사장님은 사무실에 계십니다.", "Giám đốc đang ở văn phòng."]] },
  { ko: "국적과 직업", vi: "Quốc tịch và nghề nghiệp", topic: "identity",
    words: `한국|han-guk|Hàn Quốc|general|저는 한국에서 일합니다.|Tôi làm việc ở Hàn Quốc.
베트남|bê-thư-nam|Việt Nam|general|저는 베트남 사람입니다.|Tôi là người Việt Nam.
사람|sa-ram|Người|general|저 사람은 우리 사장님입니다.|Người kia là giám đốc của chúng tôi.
학생|hak-xeng|Học sinh, sinh viên|general|동생은 학생입니다.|Em tôi là học sinh.
회사원|huê-sa-uôn|Nhân viên công ty|general|형은 회사원입니다.|Anh tôi là nhân viên công ty.
농부|nông-bu|Nông dân|agriculture|아버지는 농부입니다.|Bố tôi là nông dân.
근로자|kưn-lô-cha|Người lao động|general|저는 외국인 근로자입니다.|Tôi là lao động nước ngoài.
선생님|xon-seng-nim|Giáo viên|general|한국어 선생님이 오셨습니다.|Cô giáo tiếng Hàn đã đến.
친구|chin-gu|Bạn bè|general|친구는 공장에서 일합니다.|Bạn tôi làm ở nhà máy.
가족|ka-chôk|Gia đình|general|가족이 베트남에 있습니다.|Gia đình tôi ở Việt Nam.`,
    grammar: [
      ["-이/가", "Trợ từ chủ ngữ", "Chỉ chủ thể của hành động/trạng thái, nhấn thông tin mới.", "Có patchim: 이 · Không patchim: 가", "기계가 고장 났습니다.", "Máy bị hỏng rồi.", "친구가 옵니다.", "Bạn tôi đến."],
      ["-이/가 아닙니다", "Không phải là…", "Phủ định của '-입니다'.", "Danh từ + 이/가 아닙니다", "저는 학생이 아닙니다.", "Tôi không phải là học sinh.", "이것은 안전모가 아닙니다.", "Đây không phải là mũ bảo hộ."]] },
  { ko: "장소", vi: "Địa điểm", topic: "places",
    words: `집|chíp|Nhà|general|집에서 쉽니다.|Tôi nghỉ ở nhà.
학교|hak-kyô|Trường học|general|학교에서 한국어를 공부합니다.|Tôi học tiếng Hàn ở trường.
병원|byong-uôn|Bệnh viện|general|아파서 병원에 갑니다.|Vì đau nên tôi đi bệnh viện.
은행|ưn-heng|Ngân hàng|general|은행에서 돈을 보냅니다.|Tôi gửi tiền ở ngân hàng.
식당|xik-tang|Nhà ăn, quán ăn|general|공장 식당에서 점심을 먹습니다.|Tôi ăn trưa ở nhà ăn của nhà máy.
화장실|hoa-chang-xil|Nhà vệ sinh|general|화장실이 어디예요?|Nhà vệ sinh ở đâu?
기숙사|ki-xúc-xa|Ký túc xá|general|기숙사는 공장 옆에 있습니다.|Ký túc xá ở cạnh nhà máy.
사무실|xa-mu-xil|Văn phòng|general|사장님은 사무실에 계십니다.|Giám đốc đang ở văn phòng.
우체국|u-chê-guk|Bưu điện|general|우체국에서 편지를 보냅니다.|Tôi gửi thư ở bưu điện.
시장|xi-chang|Chợ|general|시장에서 과일을 삽니다.|Tôi mua hoa quả ở chợ.`,
    grammar: [
      ["-에 있습니다 / 없습니다", "Ở / có / không có", "Chỉ vị trí tồn tại của người, vật. Với người lớn tuổi dùng 계십니다.", "Nơi chốn + 에 + 있습니다", "기숙사는 공장 옆에 있습니다.", "Ký túc xá ở cạnh nhà máy.", "사장님은 사무실에 계십니다.", "Giám đốc ở văn phòng."],
      ["-에서", "Tại (nơi diễn ra hành động)", "Đi với động từ hành động như 일하다, 먹다, 공부하다.", "Nơi chốn + 에서", "식당에서 밥을 먹습니다.", "Tôi ăn cơm ở nhà ăn.", "공장에서 일합니다.", "Tôi làm việc ở nhà máy."]] },
  { ko: "사물", vi: "Đồ vật", topic: "objects",
    words: `책|chéc|Sách|general|책이 책상 위에 있습니다.|Sách ở trên bàn.
가방|ka-bang|Cặp, túi|general|가방 안에 휴대폰이 있습니다.|Trong túi có điện thoại.
휴대폰|hyu-đe-pon|Điện thoại di động|general|휴대폰을 사무실에 두었습니다.|Tôi để điện thoại ở văn phòng.
연필|yon-pil|Bút chì|general|연필로 쓰세요.|Hãy viết bằng bút chì.
의자|ưi-cha|Ghế|general|의자에 앉으세요.|Mời ngồi ghế.
책상|chéc-xang|Bàn học|general|책상이 큽니다.|Cái bàn to.
컴퓨터|kom-piu-thơ|Máy tính|general|컴퓨터로 서류를 만듭니다.|Làm hồ sơ bằng máy tính.
시계|xi-ghê|Đồng hồ|general|시계가 벽에 있습니다.|Đồng hồ ở trên tường.
우산|u-xan|Ô, dù|general|비가 와서 우산을 씁니다.|Vì mưa nên tôi che ô.
신발|xin-bal|Giày dép|general|안전화는 일할 때 신는 신발입니다.|Giày bảo hộ là giày đi khi làm việc.`,
    grammar: [
      ["이 / 그 / 저", "Này / đó / kia", "이: gần người nói; 그: gần người nghe; 저: xa cả hai.", "이/그/저 + danh từ", "이 기계는 위험합니다.", "Cái máy này nguy hiểm.", "저 사람은 사장님입니다.", "Người kia là giám đốc."],
      ["-도", "Cũng", "Thay cho -은/는, -이/가, -을/를 khi muốn nói 'cũng'.", "Danh từ + 도", "저도 근로자입니다.", "Tôi cũng là người lao động.", "친구도 공장에서 일합니다.", "Bạn tôi cũng làm ở nhà máy."]] },
  { ko: "시간", vi: "Thời gian", topic: "time",
    words: `시|xi|Giờ|general|지금 두 시입니다.|Bây giờ là hai giờ.
분|bun|Phút|general|십 분 후에 시작합니다.|Mười phút nữa bắt đầu.
오늘|ô-nưl|Hôm nay|general|오늘은 일이 많습니다.|Hôm nay nhiều việc.
내일|nê-il|Ngày mai|general|내일 아침에 출근합니다.|Sáng mai tôi đi làm.
어제|o-chê|Hôm qua|general|어제 야근했습니다.|Hôm qua tôi làm thêm.
아침|a-chim|Buổi sáng|general|아침 여덟 시에 일을 시작합니다.|Tám giờ sáng bắt đầu làm việc.
저녁|chơ-nyok|Buổi tối|general|저녁에 기숙사에서 쉽니다.|Buổi tối tôi nghỉ ở ký túc xá.
출근|chul-kưn|Đi làm|general|저는 일곱 시에 출근합니다.|Tôi đi làm lúc bảy giờ.
퇴근|thuê-kưn|Tan làm|general|여섯 시에 퇴근합니다.|Sáu giờ tôi tan làm.
점심시간|chom-xim-xi-gan|Giờ nghỉ trưa|general|점심시간은 열두 시부터입니다.|Giờ nghỉ trưa bắt đầu từ mười hai giờ.`,
    grammar: [
      ["-에 (thời gian)", "Vào lúc…", "Gắn sau từ chỉ thời điểm cụ thể (giờ, thứ). Không gắn với 오늘, 내일, 어제.", "Giờ/thứ + 에", "일곱 시에 출근합니다.", "Tôi đi làm lúc bảy giờ.", "내일 출근합니다.", "Ngày mai tôi đi làm. (không dùng 에)"],
      ["-부터 -까지", "Từ… đến…", "Chỉ điểm bắt đầu và kết thúc của thời gian hoặc nơi chốn.", "A + 부터 B + 까지", "아침 여덟 시부터 저녁 여섯 시까지 일합니다.", "Tôi làm từ 8 giờ sáng đến 6 giờ tối.", "월요일부터 금요일까지 일합니다.", "Tôi làm từ thứ hai đến thứ sáu."]] },
  { ko: "요일과 일정", vi: "Thứ ngày và lịch làm việc", topic: "schedule",
    words: `월요일|uô-ryô-il|Thứ hai|general|월요일에 회의가 있습니다.|Thứ hai có cuộc họp.
금요일|kưm-yô-il|Thứ sáu|general|금요일에 일찍 퇴근합니다.|Thứ sáu tôi tan làm sớm.
토요일|thô-yô-il|Thứ bảy|general|토요일에 쉽니다.|Thứ bảy tôi nghỉ.
일요일|i-ryô-il|Chủ nhật|general|일요일에는 공장이 쉽니다.|Chủ nhật nhà máy nghỉ.
주말|chu-mal|Cuối tuần|general|주말에 친구를 만납니다.|Cuối tuần tôi gặp bạn.
휴일|hyu-il|Ngày nghỉ|general|휴일에는 일하지 않습니다.|Ngày nghỉ tôi không làm việc.
월급|uôl-kưp|Tiền lương tháng|general|월급은 이십오 일에 받습니다.|Lương nhận vào ngày 25.
야근|ya-kưn|Làm thêm ban đêm|general|오늘 야근이 있습니다.|Hôm nay có tăng ca.
휴가|hyu-ga|Nghỉ phép|general|다음 달에 휴가를 갑니다.|Tháng sau tôi nghỉ phép.
약속|yak-xôk|Cuộc hẹn|general|친구와 약속이 있습니다.|Tôi có hẹn với bạn.`,
    grammar: [
      ["-았/었습니다", "Quá khứ", "Thêm vào gốc động từ/tính từ để nói việc đã xảy ra.", "ㅏ,ㅗ + 았 · còn lại + 었 · 하다 → 했", "어제 야근했습니다.", "Hôm qua tôi làm thêm.", "주말에 친구를 만났습니다.", "Cuối tuần tôi đã gặp bạn."],
      ["-(으)ㄹ 거예요", "Sẽ… (tương lai/dự định)", "Nói dự định hoặc suy đoán.", "Có patchim: -을 거예요 · Không: -ㄹ 거예요", "내일 병원에 갈 거예요.", "Ngày mai tôi sẽ đi bệnh viện.", "일요일에 쉴 거예요.", "Chủ nhật tôi sẽ nghỉ."]] },
  { ko: "음식", vi: "Ăn uống", topic: "food",
    words: `밥|bap|Cơm|general|점심에 밥을 먹습니다.|Buổi trưa tôi ăn cơm.
물|mul|Nước|general|일할 때 물을 많이 마십니다.|Khi làm việc tôi uống nhiều nước.
김치|kim-chi|Kim chi|general|한국 사람은 김치를 자주 먹습니다.|Người Hàn hay ăn kim chi.
고기|ko-ki|Thịt|general|저녁에 고기를 먹습니다.|Buổi tối tôi ăn thịt.
국|kuk|Canh|general|국이 뜨겁습니다.|Canh nóng.
커피|kho-pi|Cà phê|general|커피 한 잔 주세요.|Cho tôi một ly cà phê.
빵|bang|Bánh mì|general|아침에 빵을 먹습니다.|Buổi sáng tôi ăn bánh mì.
과일|koa-il|Hoa quả|agriculture|과일 농장에서 일합니다.|Tôi làm ở nông trại trái cây.
먹다|mok-tà|Ăn|general|식당에서 점심을 먹어요.|Tôi ăn trưa ở nhà ăn.
맛있다|ma-xít-tà|Ngon|general|김치찌개가 맛있어요.|Canh kim chi ngon.`,
    grammar: [
      ["-을/를", "Trợ từ tân ngữ", "Gắn sau danh từ là đối tượng của hành động.", "Có patchim: 을 · Không patchim: 를", "저는 밥을 먹습니다.", "Tôi ăn cơm.", "커피를 마십니다.", "Tôi uống cà phê."],
      ["-고 싶다", "Muốn…", "Diễn tả mong muốn của người nói (ngôi 1) hoặc hỏi người nghe (ngôi 2).", "Gốc động từ + -고 싶다", "한국 음식을 먹고 싶어요.", "Tôi muốn ăn món Hàn.", "쉬고 싶어요.", "Tôi muốn nghỉ ngơi."]] },
  { ko: "쇼핑", vi: "Mua sắm", topic: "shopping",
    words: `가게|ka-ghê|Cửa hàng|general|가게에서 장갑을 샀습니다.|Tôi mua găng tay ở cửa hàng.
얼마|ol-ma|Bao nhiêu (giá)|general|이것은 얼마예요?|Cái này bao nhiêu tiền?
비싸다|bi-xa-tà|Đắt|general|이 신발은 비쌉니다.|Đôi giày này đắt.
싸다|xa-tà|Rẻ|general|시장 과일은 쌉니다.|Hoa quả ở chợ rẻ.
돈|tôn|Tiền|general|돈을 은행에 보냅니다.|Tôi gửi tiền ở ngân hàng.
원|uôn|Won (tiền Hàn)|general|오천 원입니다.|Năm nghìn won.
사다|xa-tà|Mua|general|시장에서 야채를 사요.|Tôi mua rau ở chợ.
팔다|pal-tà|Bán|general|이 가게는 작업복을 팝니다.|Cửa hàng này bán quần áo bảo hộ.
많다|man-tà|Nhiều|general|오늘 일이 많아요.|Hôm nay nhiều việc.
적다|chok-tà|Ít|general|월급이 적어요.|Lương ít.`,
    grammar: [
      ["얼마예요?", "Bao nhiêu tiền?", "Hỏi giá. Trả lời bằng số + 원 (số Hán-Hàn: 천, 만…).", "Danh từ + 얼마예요?", "이 장갑은 얼마예요?", "Đôi găng tay này bao nhiêu?", "삼천 원이에요.", "Ba nghìn won."],
      ["-(으)세요", "Xin hãy… (mời/yêu cầu)", "Yêu cầu lịch sự hoặc kính ngữ.", "Có patchim: -으세요 · Không: -세요", "이것을 보세요.", "Xin hãy xem cái này.", "여기에 앉으세요.", "Mời ngồi đây."]] },
  { ko: "교통", vi: "Giao thông", topic: "transport",
    words: `버스|bo-xư|Xe buýt|general|버스를 타고 출근합니다.|Tôi đi làm bằng xe buýt.
지하철|chi-ha-chol|Tàu điện ngầm|general|지하철이 빠릅니다.|Tàu điện ngầm nhanh.
택시|thek-xi|Taxi|general|늦어서 택시를 탔습니다.|Vì trễ nên tôi bắt taxi.
기차|ki-cha|Tàu hỏa|general|기차로 부산에 갑니다.|Tôi đi Busan bằng tàu hỏa.
길|kil|Đường|general|길이 미끄럽습니다.|Đường trơn.
타다|tha-tà|Đi, lên (xe)|general|버스를 타세요.|Hãy lên xe buýt.
내리다|nê-ri-tà|Xuống (xe)|general|다음 정류장에서 내립니다.|Tôi xuống ở trạm tiếp theo.
걷다|kot-tà|Đi bộ|general|공장까지 걸어서 갑니다.|Tôi đi bộ đến nhà máy.
멀다|mol-tà|Xa|general|기숙사에서 공장까지 멉니다.|Từ ký túc xá đến nhà máy xa.
가깝다|ka-kap-tà|Gần|general|식당이 가깝습니다.|Nhà ăn gần.`,
    grammar: [
      ["-(으)로", "Bằng (phương tiện) / về hướng", "Chỉ phương tiện, công cụ hoặc hướng đi.", "Có patchim: 으로 · Không (hoặc ㄹ): 로", "지하철로 출근합니다.", "Tôi đi làm bằng tàu điện ngầm.", "비상구로 나가세요.", "Hãy ra bằng lối thoát hiểm."],
      ["-(으)ㄹ 수 있다/없다", "Có thể / không thể", "Diễn tả khả năng hoặc sự cho phép.", "Có patchim: -을 수 있다 · Không: -ㄹ 수 있다", "기계를 사용할 수 있어요.", "Tôi có thể dùng máy.", "오늘은 쉴 수 없어요.", "Hôm nay tôi không thể nghỉ."]] },
  { ko: "작업장과 도구", vi: "Nơi làm việc và dụng cụ", topic: "workplace",
    words: `망치|mang-chi|Cái búa|construction|망치로 못을 박습니다.|Dùng búa đóng đinh.
못|mốt|Cái đinh|construction|못이 위험합니다.|Cái đinh nguy hiểm.
톱|thôp|Cái cưa|construction|톱으로 나무를 자릅니다.|Dùng cưa cắt gỗ.
삽|xáp|Cái xẻng|agriculture|삽으로 땅을 팝니다.|Dùng xẻng đào đất.
장갑|chang-gáp|Găng tay|safety|장갑을 끼고 일하세요.|Hãy đeo găng tay khi làm việc.
사다리|xa-đa-ri|Cái thang|construction|사다리를 조심하세요.|Hãy cẩn thận với cái thang.
도구|tô-gu|Dụng cụ|manufacturing|작업 후에 도구를 정리하세요.|Sau khi làm xong hãy dọn dụng cụ.
기술|ki-xul|Kỹ thuật|manufacturing|기술을 배우고 싶어요.|Tôi muốn học kỹ thuật.
작업|chak-op|Công việc, thao tác|general|작업이 끝났습니다.|Công việc đã xong.
청소|chong-xô|Dọn dẹp|general|퇴근 전에 청소합니다.|Trước khi tan làm tôi dọn dẹp.`,
    grammar: [
      ["-지 마세요", "Xin đừng…", "Yêu cầu không làm gì; rất hay gặp trong lời dặn an toàn.", "Gốc động từ + -지 마세요", "기계를 만지지 마세요.", "Đừng chạm vào máy.", "여기에서 담배를 피우지 마세요.", "Đừng hút thuốc ở đây."],
      ["-(으)ㄹ 때", "Khi… / lúc…", "Chỉ thời điểm xảy ra hành động hoặc trạng thái.", "Có patchim: -을 때 · Không: -ㄹ 때", "용접할 때 보안경을 쓰세요.", "Khi hàn hãy đeo kính bảo hộ.", "일할 때 장갑을 끼세요.", "Khi làm việc hãy đeo găng tay."]] },
  // ───────── Bài 11–20 (nội dung tự soạn theo chủ đề sát nhu cầu EPS-TOPIK, KHÔNG chép từ giáo trình) ─────────
  { ko: "신체와 건강", vi: "Cơ thể và sức khỏe", topic: "health",
    words: `머리|mo-ri|Đầu|general|머리가 아파요.|Tôi đau đầu.
눈|nun|Mắt|safety|눈에 먼지가 들어갔어요.|Bụi bay vào mắt tôi.
손|xôn|Tay (bàn tay)|general|손을 다쳤습니다.|Tôi bị thương ở tay.
발|bal|Chân (bàn chân)|general|발이 아파서 쉬고 싶어요.|Chân đau nên tôi muốn nghỉ.
허리|ho-ri|Thắt lưng|general|무거운 물건을 들어서 허리가 아파요.|Vì nâng đồ nặng nên tôi đau lưng.
감기|kam-ki|Cảm cúm|general|감기에 걸려서 약을 먹었습니다.|Tôi bị cảm nên đã uống thuốc.
약|yak|Thuốc|general|식사 후에 약을 드세요.|Hãy uống thuốc sau bữa ăn.
다치다|ta-chi-tà|Bị thương|safety|작업 중에 다쳤습니다.|Tôi bị thương trong lúc làm việc.
아프다|a-pư-tà|Đau, ốm|general|배가 아파서 병원에 갔어요.|Tôi đau bụng nên đã đến bệnh viện.
건강|kon-gang|Sức khỏe|general|건강이 제일 중요합니다.|Sức khỏe là quan trọng nhất.`,
    grammar: [
      ["-아/어도 되다", "Được phép…", "Hỏi/cho phép làm gì: '…cũng được'.", "ㅏ,ㅗ + 아도 · còn lại + 어도 · 하다 → 해도 되다", "오늘 쉬어도 돼요?", "Hôm nay tôi nghỉ được không?", "여기에 앉아도 됩니다.", "Ngồi ở đây cũng được."],
      ["-(으)면 안 되다", "Không được…", "Cấm đoán, không cho phép.", "Có patchim: -으면 안 되다 · Không: -면 안 되다", "기계를 만지면 안 됩니다.", "Không được chạm vào máy.", "여기에서 담배를 피우면 안 돼요.", "Không được hút thuốc ở đây."]] },
  { ko: "날씨와 계절", vi: "Thời tiết và mùa", topic: "weather",
    words: `날씨|nal-xi|Thời tiết|general|오늘 날씨가 좋습니다.|Hôm nay thời tiết đẹp.
비|bi|Mưa|construction|비가 오면 야외 작업을 쉽니다.|Nếu trời mưa thì nghỉ làm ngoài trời.
바람|ba-ram|Gió|construction|바람이 강해서 높은 곳에서 일할 수 없어요.|Gió mạnh nên không thể làm việc trên cao.
덥다|top-tà|Nóng|general|여름에는 날씨가 덥습니다.|Mùa hè thời tiết nóng.
춥다|chup-tà|Lạnh|general|겨울에는 공장이 춥습니다.|Mùa đông nhà máy lạnh.
봄|bôm|Mùa xuân|agriculture|봄에 씨앗을 심습니다.|Mùa xuân gieo hạt.
여름|yo-rưm|Mùa hè|general|여름에는 땀이 많이 납니다.|Mùa hè ra nhiều mồ hôi.
가을|ka-ưl|Mùa thu|agriculture|가을에 사과를 수확합니다.|Mùa thu thu hoạch táo.
겨울|kyo-ul|Mùa đông|general|겨울에는 장갑이 필요합니다.|Mùa đông cần găng tay.
태풍|thê-pung|Bão|general|태풍이 오면 작업을 멈춥니다.|Khi bão đến thì dừng làm việc.`,
    grammar: [
      ["-(으)면", "Nếu… thì…", "Điều kiện giả định.", "Có patchim: -으면 · Không: -면", "비가 오면 일하지 않습니다.", "Nếu mưa thì không làm việc.", "아프면 병원에 가세요.", "Nếu ốm hãy đi bệnh viện."],
      ["-(으)ㄹ까요?", "…nhé? / …không?", "Đề nghị cùng làm hoặc hỏi ý kiến.", "Có patchim: -을까요? · Không: -ㄹ까요?", "같이 점심 먹을까요?", "Cùng ăn trưa nhé?", "몇 시에 만날까요?", "Mấy giờ chúng ta gặp?"]] },
  { ko: "집과 생활", vi: "Nhà ở và sinh hoạt", topic: "housing",
    words: `방|bang|Phòng|general|방이 깨끗합니다.|Phòng sạch sẽ.
문|mun|Cửa|general|문을 닫아 주세요.|Hãy đóng cửa giúp tôi.
창문|chang-mun|Cửa sổ|general|창문을 열면 시원합니다.|Mở cửa sổ thì mát.
침대|chim-đê|Giường|general|기숙사에는 침대가 두 개 있어요.|Ký túc xá có hai cái giường.
부엌|bu-ok|Bếp|general|부엌에서 요리합니다.|Tôi nấu ăn ở bếp.
세탁기|xê-thak-ki|Máy giặt|general|세탁기로 작업복을 빨아요.|Tôi giặt đồ bảo hộ bằng máy giặt.
냉장고|neng-chang-gô|Tủ lạnh|general|음식을 냉장고에 넣으세요.|Hãy cho đồ ăn vào tủ lạnh.
전기|chon-ki|Điện|safety|전기를 끄고 나가세요.|Hãy tắt điện rồi đi ra.
청소하다|chong-xô-ha-tà|Dọn dẹp|general|주말에 방을 청소합니다.|Cuối tuần tôi dọn phòng.
빌리다|bil-li-tà|Mượn, thuê|general|친구에게 사전을 빌렸어요.|Tôi mượn từ điển của bạn.`,
    grammar: [
      ["-아/어 주세요", "Xin hãy… giúp tôi", "Nhờ ai làm gì cho mình.", "Gốc động từ + 아/어 주세요", "문을 열어 주세요.", "Xin hãy mở cửa giúp tôi.", "천천히 말해 주세요.", "Xin hãy nói chậm lại."],
      ["-고 있다", "Đang…", "Hành động đang diễn ra.", "Gốc động từ + -고 있다", "지금 청소하고 있어요.", "Bây giờ tôi đang dọn dẹp.", "사장님이 기다리고 계십니다.", "Giám đốc đang đợi."]] },
  { ko: "안전과 규칙", vi: "An toàn và quy tắc", topic: "safety",
    words: `안전|an-chon|An toàn|safety|안전이 제일 중요합니다.|An toàn là quan trọng nhất.
위험|uy-hom|Nguy hiểm|safety|이곳은 위험합니다.|Chỗ này nguy hiểm.
조심하다|chô-xim-ha-tà|Cẩn thận|safety|바닥이 미끄러우니까 조심하세요.|Sàn trơn nên hãy cẩn thận.
규칙|kyu-chik|Quy tắc|general|공장 규칙을 지키세요.|Hãy tuân thủ quy tắc nhà máy.
지키다|chi-khi-tà|Giữ, tuân thủ|safety|안전 규칙을 지켜야 합니다.|Phải tuân thủ quy tắc an toàn.
사고|xa-gô|Tai nạn|safety|사고가 나면 바로 말하세요.|Nếu có tai nạn hãy báo ngay.
불|bul|Lửa|safety|불이 나면 비상구로 나가세요.|Nếu có cháy hãy ra lối thoát hiểm.
소화기|xô-hoa-ki|Bình chữa cháy|safety|소화기는 문 옆에 있습니다.|Bình chữa cháy ở cạnh cửa.
보호구|bô-hô-gu|Đồ bảo hộ|safety|보호구를 꼭 착용하세요.|Nhất định phải mang đồ bảo hộ.
금지|kưm-chi|Cấm|safety|여기는 흡연 금지입니다.|Ở đây cấm hút thuốc.`,
    grammar: [
      ["-아/어야 하다", "Phải…", "Diễn tả nghĩa vụ, điều bắt buộc.", "Gốc động từ + 아/어야 하다 (되다)", "안전모를 써야 합니다.", "Phải đội mũ bảo hộ.", "일하기 전에 기계를 확인해야 해요.", "Trước khi làm việc phải kiểm tra máy."],
      ["-(으)니까", "Vì… nên… (vế sau là mệnh lệnh)", "Lý do chủ quan; vế sau có thể là -(으)세요, -(으)ㅂ시다.", "Có patchim: -으니까 · Không: -니까", "위험하니까 조심하세요.", "Vì nguy hiểm nên hãy cẩn thận.", "바닥이 미끄러우니까 천천히 걸으세요.", "Sàn trơn nên hãy đi chậm."]] },
  { ko: "기계와 작업", vi: "Máy móc và thao tác", topic: "machine",
    words: `전원|chon-uôn|Nguồn điện|manufacturing|기계 전원을 끄세요.|Hãy tắt nguồn máy.
켜다|khyo-tà|Bật|manufacturing|기계를 켜기 전에 확인하세요.|Hãy kiểm tra trước khi bật máy.
끄다|kư-tà|Tắt|manufacturing|작업이 끝나면 기계를 끄세요.|Làm xong hãy tắt máy.
고장|kô-chang|Hỏng, sự cố|manufacturing|기계가 고장 났어요.|Máy bị hỏng.
수리|xu-ri|Sửa chữa|manufacturing|수리 기사가 오고 있습니다.|Thợ sửa chữa đang đến.
부품|bu-phum|Linh kiện|manufacturing|부품을 교체해야 합니다.|Phải thay linh kiện.
스위치|xư-uy-chi|Công tắc|manufacturing|빨간 스위치를 누르세요.|Hãy bấm công tắc đỏ.
누르다|nu-rư-tà|Bấm, nhấn|manufacturing|비상 버튼을 누르세요.|Hãy bấm nút khẩn cấp.
돌리다|tôl-li-tà|Xoay, quay|manufacturing|손잡이를 오른쪽으로 돌리세요.|Hãy xoay tay cầm sang phải.
기름|ki-rưm|Dầu|manufacturing|기계에 기름을 넣습니다.|Tôi đổ dầu vào máy.`,
    grammar: [
      ["-기 전에", "Trước khi…", "Hành động ở vế sau xảy ra trước hành động ở vế trước.", "Gốc động từ + -기 전에", "기계를 켜기 전에 확인하세요.", "Trước khi bật máy hãy kiểm tra.", "퇴근하기 전에 청소합니다.", "Trước khi tan làm tôi dọn dẹp."],
      ["-(으)ㄴ 후에", "Sau khi…", "Hành động ở vế sau xảy ra sau vế trước.", "Có patchim: -은 후에 · Không: -ㄴ 후에", "작업이 끝난 후에 기계를 끄세요.", "Sau khi làm xong hãy tắt máy.", "점심을 먹은 후에 일합니다.", "Sau khi ăn trưa tôi làm việc."]] },
  { ko: "농업", vi: "Nông nghiệp", topic: "agriculture",
    words: `농장|nông-chang|Nông trại|agriculture|저는 농장에서 일합니다.|Tôi làm việc ở nông trại.
밭|bát|Ruộng (khô), vườn|agriculture|밭에서 채소를 키웁니다.|Tôi trồng rau ở ruộng.
논|nôn|Ruộng lúa|agriculture|논에서 벼를 심습니다.|Tôi cấy lúa ở ruộng.
비닐하우스|bi-nil-ha-u-xư|Nhà kính (nhà màng)|agriculture|비닐하우스 안은 덥습니다.|Trong nhà kính nóng.
씨앗|xi-át|Hạt giống|agriculture|봄에 씨앗을 뿌립니다.|Mùa xuân gieo hạt giống.
심다|xim-tà|Trồng, cấy|agriculture|나무를 심었습니다.|Tôi đã trồng cây.
물을 주다|mu-rưl chu-tà|Tưới nước|agriculture|아침마다 채소에 물을 줍니다.|Sáng nào tôi cũng tưới nước cho rau.
수확|xu-hoác|Thu hoạch|agriculture|가을에 수확을 합니다.|Mùa thu thu hoạch.
비료|bi-ryô|Phân bón|agriculture|밭에 비료를 줍니다.|Tôi bón phân cho ruộng.
소|xô|Con bò|agriculture|축사에서 소를 키웁니다.|Tôi nuôi bò ở chuồng.`,
    grammar: [
      ["-마다", "Mỗi… / cứ…", "Chỉ sự lặp lại đều đặn.", "Danh từ + 마다", "아침마다 밭에 갑니다.", "Sáng nào tôi cũng ra ruộng.", "일요일마다 쉽니다.", "Chủ nhật nào tôi cũng nghỉ."],
      ["-(으)러 가다/오다", "Đi/đến để…", "Chỉ mục đích của việc đi hoặc đến.", "Có patchim: -으러 · Không: -러", "채소를 사러 시장에 갑니다.", "Tôi đi chợ để mua rau.", "일하러 한국에 왔습니다.", "Tôi đến Hàn Quốc để làm việc."]] },
  { ko: "건설 현장", vi: "Công trường xây dựng", topic: "construction",
    words: `건설|kon-xol|Xây dựng|construction|건설 현장에서 일합니다.|Tôi làm ở công trường xây dựng.
현장|hyon-chang|Hiện trường, công trường|construction|현장에서는 안전모를 쓰세요.|Ở công trường hãy đội mũ bảo hộ.
시멘트|xi-men-thư|Xi măng|construction|시멘트를 물과 섞습니다.|Trộn xi măng với nước.
벽돌|byok-tôl|Gạch|construction|벽돌을 쌓습니다.|Xây (chồng) gạch.
철근|chol-kưn|Thép xây dựng|construction|철근을 옮깁니다.|Tôi vận chuyển thép.
비계|bi-ghê|Giàn giáo|construction|비계 위에서는 조심하세요.|Hãy cẩn thận khi ở trên giàn giáo.
크레인|khư-rê-in|Cần cẩu|construction|크레인 아래로 가지 마세요.|Đừng đi dưới cần cẩu.
높다|nốp-tà|Cao|construction|높은 곳에서는 안전벨트를 매세요.|Ở trên cao hãy thắt dây an toàn.
쌓다|ssa-tà|Chất, xếp chồng|construction|물건을 높이 쌓지 마세요.|Đừng xếp đồ quá cao.
옮기다|ôm-ki-tà|Chuyển, di chuyển|construction|벽돌을 트럭으로 옮깁니다.|Chuyển gạch bằng xe tải.`,
    grammar: [
      ["-(으)ㄴ + danh từ", "Định ngữ cho tính từ", "Tính từ đứng trước danh từ để bổ nghĩa.", "Có patchim: -은 · Không: -ㄴ", "높은 곳에서는 조심하세요.", "Ở nơi cao hãy cẩn thận.", "무거운 물건을 들지 마세요.", "Đừng nâng đồ nặng."],
      ["-(으)면서", "Vừa… vừa…", "Hai hành động cùng lúc.", "Có patchim: -으면서 · Không: -면서", "음악을 들으면서 일합니다.", "Tôi vừa nghe nhạc vừa làm việc.", "걸으면서 전화하지 마세요.", "Đừng vừa đi vừa nghe điện thoại."]] },
  { ko: "제조와 섬유", vi: "Sản xuất và may mặc", topic: "manufacturing",
    words: `재봉틀|chê-bông-thưl|Máy may|textile|재봉틀로 옷을 만듭니다.|Tôi may quần áo bằng máy may.
실|xil|Chỉ|textile|바늘에 실을 끼웁니다.|Xỏ chỉ vào kim.
바늘|ba-nưl|Kim|textile|바늘에 손을 다치지 마세요.|Đừng để kim đâm vào tay.
천|chon|Vải|textile|천을 자릅니다.|Cắt vải.
옷|ot|Quần áo|textile|이 공장은 옷을 만듭니다.|Nhà máy này sản xuất quần áo.
가위|ka-uy|Cái kéo|textile|가위로 실을 자릅니다.|Cắt chỉ bằng kéo.
포장|phô-chang|Đóng gói|manufacturing|상자에 제품을 포장합니다.|Đóng gói sản phẩm vào thùng.
제품|chê-phum|Sản phẩm|manufacturing|완성된 제품을 검사합니다.|Kiểm tra sản phẩm đã hoàn thành.
검사|kom-xa|Kiểm tra|manufacturing|출하 전에 제품을 검사합니다.|Kiểm tra sản phẩm trước khi xuất xưởng.
불량|bul-ryang|Hàng lỗi|manufacturing|불량이 있으면 따로 놓으세요.|Nếu có hàng lỗi hãy để riêng.`,
    grammar: [
      ["-아/어 보다", "Thử làm…", "Thử trải nghiệm một việc.", "Gốc động từ + 아/어 보다", "이 기계를 사용해 보세요.", "Hãy thử dùng máy này.", "한국 음식을 먹어 봤어요.", "Tôi đã thử ăn món Hàn."],
      ["-(으)ㄹ 것 같다", "Có vẻ sẽ… / chắc là…", "Suy đoán của người nói.", "Có patchim: -을 것 같다 · Không: -ㄹ 것 같다", "내일 비가 올 것 같아요.", "Có vẻ ngày mai sẽ mưa.", "오늘 일이 늦게 끝날 것 같아요.", "Hôm nay có vẻ sẽ xong muộn."]] },
  { ko: "수산업", vi: "Thủy sản", topic: "fishery",
    words: `바다|ba-đa|Biển|fishery|바다에서 일합니다.|Tôi làm việc trên biển.
배|be|Tàu thuyền|fishery|배를 타고 고기를 잡습니다.|Tôi đi tàu đánh cá.
물고기|mul-kô-ki|Cá|fishery|물고기를 잡습니다.|Tôi bắt cá.
어부|o-bu|Ngư dân|fishery|아버지는 어부입니다.|Bố tôi là ngư dân.
그물|kư-mul|Lưới|fishery|그물을 던집니다.|Tôi thả lưới.
어시장|o-xi-chang|Chợ cá|fishery|어시장에서 생선을 팝니다.|Bán cá ở chợ cá.
양식장|yang-xik-chang|Trại nuôi trồng thủy sản|fishery|양식장에서 새우를 키웁니다.|Nuôi tôm ở trại nuôi trồng.
구명조끼|ku-myong-chô-ki|Áo phao|safety|배에서는 구명조끼를 입으세요.|Hãy mặc áo phao trên tàu.
파도|pha-đô|Sóng|fishery|파도가 높으면 출항하지 않습니다.|Nếu sóng cao thì không ra khơi.
얼음|o-rưm|Đá lạnh|fishery|생선에 얼음을 넣습니다.|Cho đá vào cá.`,
    grammar: [
      ["-기 때문에", "Vì… nên…", "Nêu nguyên nhân khách quan, dùng được với danh từ (-이기 때문에).", "Gốc động từ + -기 때문에", "파도가 높기 때문에 배가 못 나갑니다.", "Vì sóng cao nên tàu không ra khơi được.", "비 때문에 일을 못 했어요.", "Vì mưa nên tôi không làm việc được."],
      ["-(으)려고 하다", "Định… / dự định…", "Diễn tả ý định.", "Có patchim: -으려고 하다 · Không: -려고 하다", "다음 달에 고향에 가려고 해요.", "Tháng sau tôi định về quê.", "한국어를 더 배우려고 합니다.", "Tôi định học tiếng Hàn nhiều hơn."]] },
  { ko: "직장 생활", vi: "Cuộc sống nơi làm việc", topic: "work-life",
    words: `보고|bô-gô|Báo cáo|general|사장님께 보고하세요.|Hãy báo cáo với giám đốc.
지시|chi-xi|Chỉ thị|general|사장님의 지시를 듣습니다.|Tôi nghe chỉ thị của giám đốc.
회의|huê-ưi|Cuộc họp|general|아침에 회의가 있습니다.|Buổi sáng có cuộc họp.
계약|kyê-yak|Hợp đồng|general|근로 계약서를 읽어 보세요.|Hãy đọc hợp đồng lao động.
휴게시간|hyu-ghê-xi-gan|Giờ nghỉ giải lao|general|휴게시간에 커피를 마십니다.|Tôi uống cà phê vào giờ giải lao.
급여|kưp-yo|Tiền lương|general|급여는 은행 계좌로 받습니다.|Nhận lương qua tài khoản ngân hàng.
보험|bô-hom|Bảo hiểm|general|건강 보험에 가입했습니다.|Tôi đã tham gia bảo hiểm y tế.
동료|tông-ryô|Đồng nghiệp|general|동료와 같이 일합니다.|Tôi làm cùng đồng nghiệp.
질문|chil-mun|Câu hỏi|general|질문이 있으면 말씀하세요.|Nếu có câu hỏi hãy nói.
도와주다|tô-oa-chu-tà|Giúp đỡ|general|동료를 도와줍니다.|Tôi giúp đồng nghiệp.`,
    grammar: [
      ["-(으)ㄹ게요", "Tôi sẽ… (hứa, quyết định tại chỗ)", "Người nói hứa hoặc quyết định làm gì với người nghe.", "Có patchim: -을게요 · Không: -ㄹ게요", "제가 도와줄게요.", "Để tôi giúp cho.", "내일 일찍 올게요.", "Ngày mai tôi sẽ đến sớm."],
      ["-(으)시-", "Kính ngữ", "Thêm vào động từ khi chủ ngữ là người cần tôn trọng.", "Có patchim: -으시- · Không: -시-", "사장님이 오십니다.", "Giám đốc đến.", "선생님께서 말씀하셨습니다.", "Thầy đã nói."]] },
];

fs.mkdirSync("data/lessons", { recursive: true });
const index = [];
L.forEach((l, i) => {
  const n = i + 1, nn = String(n).padStart(2, "0"), id = "L" + nn;
  const ex = EXP[n] || {};
  // Từ vựng 1 = 5 từ đầu + more1 · Từ vựng 2 = 5 từ sau + more2 (mở rộng ở tools/expansions.mjs)
  const base = l.words.split("\n");
  const lines = [...base.slice(0, 5).concat(ex.more1 || []).map((s) => [s, 1]), ...base.slice(5).concat(ex.more2 || []).map((s) => [s, 2])];
  const vocabulary = lines.map(([line, group], j) => {
    const [ko, viPhonetic, meaning, field, exKo, exVi, posOverride] = line.split("|");
    if (!exVi) throw new Error(`Dòng thiếu cột: ${id} #${j + 1}`);
    return { id: `${id}-V${String(j + 1).padStart(3, "0")}`, group, ko, pos: posOverride || guessPos(ko), viPhonetic, meaning, field, example: { ko: exKo, vi: exVi }, tags: [l.topic] };
  });
  const dlg = DIALOGUES[i];
  if (!dlg) throw new Error("Thiếu hội thoại bài " + n);
  const mkDlg = (d, k) => ({ id: `${id}-D00${k}`, title: d[0], situation: d[1], lines: d[2].map(([speaker, ko, vi]) => ({ speaker, ko, vi })) });
  const dialogues = [mkDlg(dlg, 1), ...(ex.dialogue2 ? [mkDlg(ex.dialogue2, 2)] : [])];
  const grammar = l.grammar.concat(ex.grammar || []).map((g, j) => ({
    id: `${id}-G${String(j + 1).padStart(3, "0")}`, pattern: g[0], meaning: g[1], explanation: g[2], formation: g[3],
    examples: [{ ko: g[4], vi: g[5] }, { ko: g[6], vi: g[7] }],
  }));
  fs.writeFileSync(`data/lessons/lesson-${nn}.json`, JSON.stringify({ id, number: n, book: 1, topic: l.topic, title: { ko: l.ko, vi: l.vi }, vocabGroups: [{ group: 1, title: "Từ vựng 1" }, { group: 2, title: "Từ vựng 2" }], source: { verified: false }, vocabulary, grammar, dialogues, ...(ex.culture ? { culture: ex.culture } : {}) }, null, 2));
  index.push({ id, number: n, file: `lesson-${nn}.json`, title: l.vi, ko: l.ko, vocabCount: vocabulary.length });
});
fs.writeFileSync("data/lessons/index.json", JSON.stringify(index, null, 2));
console.log("OK", index.length, "bài,", index.reduce((s, x) => s + x.vocabCount, 0), "từ");
