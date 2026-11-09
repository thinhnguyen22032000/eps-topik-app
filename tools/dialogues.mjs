// Hội thoại mẫu cho từng bài (theo thứ tự bài 1..20). Mỗi mục: [tiêu đề, bối cảnh, [[người nói, tiếng Hàn, tiếng Việt], ...]]
export const DIALOGUES = [
  ["Gặp giám đốc ngày đầu đi làm", "Ngày đầu tiên, anh Nguyễn gặp giám đốc ở nhà máy.", [
    ["사장님", "안녕하세요? 이름이 뭐예요?", "Chào bạn. Tên bạn là gì?"],
    ["응우옌", "안녕하세요, 사장님. 저는 응우옌입니다. 베트남 사람입니다.", "Chào giám đốc. Tôi là Nguyễn, người Việt Nam."],
    ["사장님", "만나서 반갑습니다. 오늘부터 이 공장에서 일하세요.", "Rất vui được gặp. Từ hôm nay bạn làm việc ở nhà máy này."],
    ["응우옌", "네, 감사합니다. 열심히 하겠습니다.", "Vâng, cảm ơn. Tôi sẽ làm việc chăm chỉ."]]],
  ["Hỏi quốc tịch, nghề nghiệp", "Hai đồng nghiệp làm quen trong giờ nghỉ.", [
    ["민수", "저는 한국 사람입니다. 응우옌 씨는 어느 나라 사람이에요?", "Tôi là người Hàn. Anh Nguyễn là người nước nào?"],
    ["응우옌", "저는 베트남 사람입니다. 민수 씨는 회사원이에요?", "Tôi là người Việt Nam. Anh Minsu là nhân viên công ty à?"],
    ["민수", "네, 회사원입니다. 응우옌 씨는 학생이에요?", "Vâng. Anh Nguyễn là sinh viên à?"],
    ["응우옌", "아니요, 학생이 아닙니다. 근로자입니다.", "Không, tôi không phải sinh viên. Tôi là người lao động."]]],
  ["Hỏi đường trong nhà máy", "Người mới hỏi vị trí nhà vệ sinh và ký túc xá.", [
    ["응우옌", "실례합니다. 화장실이 어디예요?", "Xin lỗi, nhà vệ sinh ở đâu ạ?"],
    ["직원", "저기 사무실 옆에 있어요.", "Ở kia, cạnh văn phòng."],
    ["응우옌", "기숙사는 어디에 있어요?", "Ký túc xá ở đâu ạ?"],
    ["직원", "기숙사는 공장 뒤에 있습니다.", "Ký túc xá ở phía sau nhà máy."]]],
  ["Đồ vật của ai?", "Giám đốc hỏi về đồ đạc để quên ở văn phòng.", [
    ["사장님", "응우옌 씨, 그 가방 안에 무엇이 있어요?", "Anh Nguyễn, trong cái túi đó có gì?"],
    ["응우옌", "책하고 휴대폰이 있어요.", "Có sách và điện thoại."],
    ["사장님", "이 휴대폰도 응우옌 씨 거예요?", "Cái điện thoại này cũng của anh à?"],
    ["응우옌", "아니요, 그것은 제 것이 아닙니다. 친구 거예요.", "Không, đó không phải của tôi. Của bạn tôi."]]],
  ["Hỏi giờ làm việc", "Đồng nghiệp hỏi về giờ đi làm, tan làm.", [
    ["직원", "몇 시에 출근해요?", "Anh đi làm lúc mấy giờ?"],
    ["응우옌", "아침 여덟 시에 출근해요.", "Tôi đi làm lúc 8 giờ sáng."],
    ["직원", "퇴근은 몇 시예요?", "Mấy giờ tan làm?"],
    ["응우옌", "저녁 여섯 시에 퇴근합니다. 점심시간은 열두 시부터 한 시까지예요.", "Tôi tan làm lúc 6 giờ tối. Nghỉ trưa từ 12 giờ đến 1 giờ."]]],
  ["Lịch làm việc và lương", "Giám đốc thông báo lịch tăng ca và ngày nhận lương.", [
    ["사장님", "이번 주 토요일에 일해요?", "Thứ bảy tuần này anh có làm không?"],
    ["응우옌", "네, 야근이 있어서 일해요. 일요일에는 쉬어요.", "Có, vì có tăng ca nên tôi làm. Chủ nhật tôi nghỉ."],
    ["사장님", "월급은 이십오 일에 받습니다.", "Lương nhận vào ngày 25."],
    ["응우옌", "알겠습니다. 감사합니다.", "Tôi hiểu rồi, cảm ơn."]]],
  ["Ăn trưa ở nhà ăn", "Hai đồng nghiệp rủ nhau đi ăn trưa.", [
    ["동료", "점심에 뭐 먹고 싶어요?", "Trưa nay muốn ăn gì?"],
    ["응우옌", "김치찌개를 먹고 싶어요. 맛있어요.", "Tôi muốn ăn canh kim chi. Ngon lắm."],
    ["동료", "좋아요. 같이 식당에 갈까요?", "Được. Cùng đến nhà ăn nhé?"],
    ["응우옌", "네, 물도 마시고 싶어요.", "Vâng, tôi cũng muốn uống nước."]]],
  ["Mua găng tay ở cửa hàng", "Anh Nguyễn mua đồ bảo hộ ở cửa hàng gần nhà máy.", [
    ["응우옌", "이 장갑은 얼마예요?", "Đôi găng tay này bao nhiêu?"],
    ["주인", "삼천 원이에요.", "Ba nghìn won."],
    ["응우옌", "조금 비싸요. 싼 것 있어요?", "Hơi đắt. Có cái nào rẻ hơn không?"],
    ["주인", "이것은 이천 원이에요. 보세요.", "Cái này hai nghìn won. Xin hãy xem."]]],
  ["Đi làm bằng gì?", "Hỏi đồng nghiệp cách đến nhà máy.", [
    ["응우옌", "공장까지 어떻게 가요?", "Đi đến nhà máy bằng cách nào?"],
    ["동료", "버스로 갈 수 있어요. 삼십 분 걸려요.", "Đi bằng xe buýt được. Mất 30 phút."],
    ["응우옌", "지하철은 멀어요?", "Tàu điện ngầm có xa không?"],
    ["동료", "아니요, 가까워요. 지하철이 더 빨라요.", "Không, gần. Tàu điện ngầm nhanh hơn."]]],
  ["Tổ trưởng giao việc", "Tổ trưởng yêu cầu chuẩn bị dụng cụ.", [
    ["반장", "망치와 못을 가져오세요.", "Hãy mang búa và đinh đến."],
    ["응우옌", "네. 장갑도 껴야 해요?", "Vâng. Có phải đeo găng tay không?"],
    ["반장", "네, 일할 때 장갑을 끼세요. 못을 만지지 마세요.", "Có, khi làm việc hãy đeo găng tay. Đừng chạm tay vào đinh."],
    ["응우옌", "알겠습니다. 작업 후에 청소할게요.", "Tôi hiểu rồi. Làm xong tôi sẽ dọn dẹp."]]],
  ["Xin nghỉ vì ốm", "Anh Nguyễn báo với giám đốc là mình bị ốm.", [
    ["응우옌", "사장님, 머리가 아파서 일할 수 없어요.", "Giám đốc, tôi đau đầu nên không làm việc được."],
    ["사장님", "감기에 걸렸어요? 병원에 가세요.", "Anh bị cảm à? Hãy đi bệnh viện."],
    ["응우옌", "오늘 쉬어도 돼요?", "Hôm nay tôi nghỉ được không?"],
    ["사장님", "네, 쉬세요. 약을 꼭 드세요.", "Được, nghỉ đi. Nhớ uống thuốc nhé."]]],
  ["Bão sắp đến", "Tổ trưởng thông báo kế hoạch khi có bão.", [
    ["반장", "내일 태풍이 올 것 같아요.", "Ngày mai có vẻ bão sẽ đến."],
    ["응우옌", "그러면 야외 작업을 해요?", "Vậy có làm việc ngoài trời không?"],
    ["반장", "비가 오면 작업을 쉽니다. 공장 안에서 일할까요?", "Nếu mưa thì nghỉ. Hay làm trong nhà máy nhé?"],
    ["응우옌", "네, 좋아요.", "Vâng, được ạ."]]],
  ["Trong ký túc xá", "Hai bạn cùng phòng nói chuyện buổi tối.", [
    ["응우옌", "방이 좀 추워요. 창문을 닫아 주세요.", "Phòng hơi lạnh. Làm ơn đóng cửa sổ giúp."],
    ["룸메이트", "네, 닫을게요. 지금 뭐 하고 있어요?", "Vâng, tôi sẽ đóng. Bây giờ bạn đang làm gì?"],
    ["응우옌", "세탁기로 작업복을 빨고 있어요.", "Tôi đang giặt đồ bảo hộ bằng máy giặt."],
    ["룸메이트", "나갈 때 전기를 꺼 주세요.", "Khi ra ngoài làm ơn tắt điện."]]],
  ["Quy tắc an toàn", "Tổ trưởng hướng dẫn an toàn cho công nhân mới.", [
    ["반장", "여기는 위험하니까 조심하세요.", "Chỗ này nguy hiểm nên hãy cẩn thận."],
    ["응우옌", "보호구를 꼭 착용해야 해요?", "Có nhất định phải mang đồ bảo hộ không?"],
    ["반장", "네, 안전 규칙을 지켜야 합니다. 사고가 나면 바로 말하세요.", "Có, phải tuân thủ quy tắc an toàn. Nếu có tai nạn hãy báo ngay."],
    ["응우옌", "알겠습니다. 소화기는 어디에 있어요?", "Tôi hiểu. Bình chữa cháy ở đâu?"],
    ["반장", "문 옆에 있습니다.", "Ở cạnh cửa."]]],
  ["Máy bị hỏng", "Báo sự cố máy với tổ trưởng.", [
    ["응우옌", "반장님, 기계가 고장 났어요.", "Tổ trưởng, máy bị hỏng rồi."],
    ["반장", "먼저 전원을 끄세요. 수리 기사를 부를게요.", "Trước hết hãy tắt nguồn. Tôi sẽ gọi thợ sửa."],
    ["응우옌", "수리한 후에 다시 켜도 돼요?", "Sau khi sửa xong có được bật lại không?"],
    ["반장", "네, 하지만 켜기 전에 꼭 확인하세요.", "Được, nhưng trước khi bật nhất định phải kiểm tra."]]],
  ["Việc ở nông trại", "Chủ nông trại giao việc buổi sáng.", [
    ["주인", "아침마다 채소에 물을 주세요.", "Sáng nào cũng hãy tưới nước cho rau."],
    ["응우옌", "네. 비료도 줄까요?", "Vâng. Có cần bón phân không?"],
    ["주인", "오늘은 비닐하우스에 가서 씨앗을 심으세요.", "Hôm nay hãy vào nhà kính gieo hạt."],
    ["응우옌", "알겠습니다. 가을에 수확해요?", "Tôi hiểu. Mùa thu thì thu hoạch ạ?"]]],
  ["Làm việc trên cao", "Tổ trưởng dặn dò ở công trường.", [
    ["반장", "높은 곳에서는 안전벨트를 매세요.", "Ở nơi cao hãy thắt dây an toàn."],
    ["응우옌", "벽돌은 어디로 옮겨요?", "Gạch chuyển đi đâu ạ?"],
    ["반장", "2층으로 옮기세요. 크레인 아래로 가지 마세요.", "Hãy chuyển lên tầng 2. Đừng đi dưới cần cẩu."],
    ["응우옌", "네, 조심하면서 일하겠습니다.", "Vâng, tôi sẽ vừa cẩn thận vừa làm."]]],
  ["Kiểm tra hàng lỗi", "Ở xưởng may, tổ trưởng yêu cầu kiểm tra sản phẩm.", [
    ["반장", "이 제품은 불량이 있어요. 다시 검사해 보세요.", "Sản phẩm này có lỗi. Hãy thử kiểm tra lại."],
    ["응우옌", "불량은 어디에 놓을까요?", "Hàng lỗi để ở đâu ạ?"],
    ["반장", "저 상자에 따로 놓으세요.", "Hãy để riêng vào cái thùng kia."],
    ["응우옌", "네. 오늘 포장은 늦게 끝날 것 같아요.", "Vâng. Hôm nay đóng gói có vẻ sẽ xong muộn."]]],
  ["Sóng cao, tàu không ra khơi", "Thuyền trưởng giao việc khi thời tiết xấu.", [
    ["선장", "오늘 파도가 높기 때문에 배가 못 나갑니다.", "Hôm nay sóng cao nên tàu không ra khơi được."],
    ["응우옌", "그럼 무엇을 할까요?", "Vậy tôi làm gì ạ?"],
    ["선장", "그물을 고치세요. 배에서는 구명조끼를 입어야 합니다.", "Hãy sửa lưới. Trên tàu phải mặc áo phao."],
    ["응우옌", "네, 알겠습니다. 내일은 출항하려고 해요?", "Vâng. Ngày mai định ra khơi ạ?"]]],
  ["Hỏi giám đốc về lương, bảo hiểm", "Người lao động hỏi về quyền lợi.", [
    ["응우옌", "사장님, 질문이 있어요.", "Giám đốc, tôi có câu hỏi."],
    ["사장님", "네, 말씀하세요.", "Vâng, cứ nói."],
    ["응우옌", "급여는 어디로 받습니까? 보험도 있어요?", "Tôi nhận lương qua đâu? Có bảo hiểm không?"],
    ["사장님", "은행 계좌로 받습니다. 보험은 제가 설명해 줄게요.", "Nhận qua tài khoản ngân hàng. Bảo hiểm tôi sẽ giải thích."]]],
];
