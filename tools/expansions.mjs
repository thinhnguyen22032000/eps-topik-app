// Phần mở rộng cho từng bài: thêm từ vựng (more1 → Từ vựng 1, more2 → Từ vựng 2), ngữ pháp, hội thoại 2, văn hóa/công xưởng.
// Dòng từ: "hàn|phiên âm|nghĩa|ngành|câu ví dụ|nghĩa câu[|từ loại]"  (từ loại bỏ trống thì tự đoán)
// Bài nào chưa có mục ở đây thì giữ nội dung cũ (UI tự ẩn phần còn thiếu). Mở rộng dần từng bài bằng cách thêm khóa số bài.
export const EXP = {
  1: {
    more1: [
      "안녕히 가세요|an-nyong-hi ka-xê-yô|Tạm biệt (nói với người ra về)|general|사장님, 안녕히 가세요.|Chào giám đốc, giám đốc đi cẩn thận ạ.",
      "죄송합니다|choe-xông-ham-ni-tà|Xin lỗi|general|늦어서 죄송합니다.|Xin lỗi vì tôi đến muộn.",
      "네|nê|Vâng, dạ|general|네, 알겠습니다.|Vâng, tôi hiểu rồi.|Cụm từ",
      "아니요|a-ni-yô|Không|general|아니요, 괜찮습니다.|Không, không sao ạ.",
      "외국인|uê-guk-in|Người nước ngoài|general|저는 외국인 근로자입니다.|Tôi là lao động người nước ngoài.",
    ],
    more2: [
      "작업복|chak-op-bốc|Quần áo bảo hộ lao động|safety|작업복을 입고 일하세요.|Hãy mặc đồ bảo hộ khi làm việc.",
      "안전화|an-chon-hoa|Giày bảo hộ|safety|안전화를 신으세요.|Hãy đi giày bảo hộ.",
      "보안경|bô-an-kyoong|Kính bảo hộ|safety|보안경을 쓰세요.|Hãy đeo kính bảo hộ.",
      "작업장|chak-op-chang|Nơi làm việc, xưởng|general|작업장은 이층에 있습니다.|Xưởng làm việc ở tầng hai.",
      "반장|ban-chang|Tổ trưởng|general|반장님이 일을 알려 줍니다.|Tổ trưởng chỉ việc cho tôi.",
    ],
    grammar: [
      ["-ㅂ니다 / -습니다", "Đuôi câu trang trọng", "Gắn vào gốc động từ/tính từ để nói trang trọng, dùng với giám đốc, tổ trưởng, khi báo cáo.", "Không patchim: -ㅂ니다 · Có patchim: -습니다", "저는 일합니다.", "Tôi làm việc.", "밥을 먹습니다.", "Tôi ăn cơm."],
    ],
    dialogue2: ["Nhận đồ bảo hộ ở xưởng", "Tổ trưởng dẫn anh Nguyễn vào xưởng và dặn về đồ bảo hộ.", [
      ["반장", "응우옌 씨, 이쪽으로 오세요. 여기가 작업장입니다.", "Anh Nguyễn, mời đi lối này. Đây là xưởng làm việc."],
      ["응우옌", "네, 반장님. 안전모는 어디에 있습니까?", "Vâng, tổ trưởng. Mũ bảo hộ ở đâu ạ?"],
      ["반장", "저기 있습니다. 작업복과 안전화도 입으세요.", "Ở đằng kia. Hãy mặc cả đồ bảo hộ và giày bảo hộ nữa."],
      ["응우옌", "알겠습니다. 용접할 때는 보안경을 써야 합니까?", "Tôi hiểu. Khi hàn có phải đeo kính bảo hộ không?"],
      ["반장", "네, 꼭 쓰세요. 기계는 제가 알려 줄게요.", "Có, nhất định phải đeo. Tôi sẽ chỉ cho anh về máy móc."],
      ["응우옌", "감사합니다. 죄송합니다, 한국어를 잘 못해요.", "Cảm ơn ạ. Xin lỗi, tôi chưa giỏi tiếng Hàn."]]],
    culture: { title: "Chào hỏi và quy tắc khi vào xưởng", items: [
      { h: "Cúi chào cấp trên", body: "Ở Hàn Quốc, người ta chào bằng cách cúi đầu nhẹ và nói 안녕하세요. Với giám đốc hoặc người lớn tuổi, hãy cúi sâu hơn và dùng thể trang trọng (-ㅂ니다/-습니다)." },
      { h: "Dùng hai tay", body: "Khi đưa hoặc nhận giấy tờ, đồ vật từ cấp trên, nên dùng hai tay (hoặc một tay đỡ tay kia) để thể hiện sự tôn trọng." },
      { h: "Đồ bảo hộ trước tiên", body: "Trước khi vào khu vực sản xuất phải mặc đúng đồ bảo hộ quy định (mũ, giày, kính… tùy công việc). Không chắc thì hỏi tổ trưởng, không tự ý làm." },
      { h: "Báo ngay khi có vấn đề", body: "Gặp sự cố hoặc chưa hiểu chỉ dẫn, hãy nói ngay với tổ trưởng/giám đốc (보고). Nói muộn dễ gây tai nạn." },
    ] },
  },
  2: {
    more1: [
      "외국|uê-guk|Nước ngoài|general|외국에서 일하고 싶어요.|Tôi muốn làm việc ở nước ngoài.",
      "나라|na-ra|Đất nước|general|어느 나라 사람이에요?|Bạn là người nước nào?",
      "일본|il-bôn|Nhật Bản|general|일본 사람도 이 공장에서 일해요.|Người Nhật cũng làm ở nhà máy này.",
      "중국|chung-guk|Trung Quốc|general|중국 기계를 사용합니다.|Tôi dùng máy của Trung Quốc.",
      "기술자|ki-xul-cha|Kỹ thuật viên|manufacturing|기술자가 기계를 고칩니다.|Kỹ thuật viên sửa máy.",
    ],
    more2: [
      "요리사|yô-ri-xa|Đầu bếp|general|요리사가 식당에서 일합니다.|Đầu bếp làm việc ở nhà ăn.",
      "운전기사|un-chon-ki-xa|Tài xế|general|운전기사가 트럭을 운전합니다.|Tài xế lái xe tải.",
      "의사|ưi-xa|Bác sĩ|general|의사가 병원에 있습니다.|Bác sĩ đang ở bệnh viện.",
      "어머니|o-mo-ni|Mẹ|general|어머니는 베트남에 계십니다.|Mẹ tôi ở Việt Nam.",
      "아버지|a-bo-chi|Bố|general|아버지는 고향에서 일하십니다.|Bố tôi làm việc ở quê.",
    ],
    grammar: [
      ["-와/과", "Và, cùng với", "Nối hai danh từ, hoặc chỉ 'cùng với ai'.", "Có patchim: 과 · Không patchim: 와", "책과 연필이 있습니다.", "Có sách và bút chì.", "친구와 같이 일합니다.", "Tôi làm cùng bạn."],
    ],
    dialogue2: ["Nói chuyện về gia đình", "Giờ nghỉ trưa, hai đồng nghiệp hỏi nhau về gia đình.", [
      ["동료", "응우옌 씨, 가족이 몇 명이에요?", "Anh Nguyễn, gia đình anh có mấy người?"],
      ["응우옌", "다섯 명이에요. 어머니, 아버지, 동생 두 명과 저입니다.", "Năm người. Mẹ, bố, hai em và tôi."],
      ["동료", "아버지는 무슨 일을 하세요?", "Bố anh làm nghề gì?"],
      ["응우옌", "농부입니다. 베트남에서 쌀을 키웁니다.", "Là nông dân. Bố trồng lúa ở Việt Nam."],
      ["동료", "그래요? 저도 고향에서 농사를 지었어요.", "Vậy à? Tôi cũng từng làm nông ở quê."],
      ["응우옌", "정말요? 우리 이야기를 더 해요.", "Thật sao? Chúng ta nói chuyện thêm đi."]]],
    culture: { title: "Cách xưng hô và kính ngữ nơi làm việc", items: [
      { h: "Tên + 씨 và chức danh + 님", body: "Đồng nghiệp ngang cấp thường gọi nhau bằng tên + 씨. Với cấp trên, gọi theo chức danh + 님 (사장님, 반장님), không gọi tên trống không." },
      { h: "Thứ bậc và tuổi tác", body: "Người Hàn coi trọng thứ bậc. Hãy dùng thể trang trọng hoặc -(으)세요 với cấp trên và người lớn tuổi." },
      { h: "Hỏi chuyện gia đình", body: "Hỏi về gia đình, quê quán là cách làm quen thông thường, không phải tò mò quá mức. Bạn cũng có thể hỏi lại như vậy." },
      { h: "Đúng giờ", body: "Đến sớm vài phút trước giờ làm thường được xem là lịch sự. Nếu đến muộn, hãy báo và xin lỗi (죄송합니다)." },
    ] },
  },
  3: {
    more1: [
      "공원|kông-uôn|Công viên|general|공원에서 산책합니다.|Tôi đi dạo ở công viên.",
      "편의점|phyo-ni-chom|Cửa hàng tiện lợi|general|편의점에서 물을 샀어요.|Tôi mua nước ở cửa hàng tiện lợi.",
      "약국|yak-guk|Hiệu thuốc|general|약국에서 약을 삽니다.|Tôi mua thuốc ở hiệu thuốc.",
      "역|yok|Ga, trạm|general|역은 공장 근처에 있습니다.|Ga ở gần nhà máy.",
      "근처|kưn-chơ|Gần đây, khu vực lân cận|general|공장 근처에 식당이 있어요.|Gần nhà máy có nhà ăn.",
    ],
    more2: [
      "창고|chang-gô|Kho|manufacturing|창고에 부품이 있습니다.|Trong kho có linh kiện.",
      "휴게실|hyu-ghê-xil|Phòng nghỉ|general|휴게실에서 쉽니다.|Tôi nghỉ ở phòng nghỉ.",
      "출입구|chul-íp-ku|Cửa ra vào|safety|출입구 앞에 서 있지 마세요.|Đừng đứng trước cửa ra vào.",
      "계단|kyê-tan|Cầu thang|safety|계단에서 뛰지 마세요.|Đừng chạy trên cầu thang.",
      "앞|áp|Phía trước|general|공장 앞에 버스가 있어요.|Có xe buýt ở trước nhà máy.",
    ],
    grammar: [
      ["위 · 아래 · 앞 · 뒤 · 옆", "Từ chỉ vị trí", "Đặt sau danh từ để chỉ vị trí tương đối, thường đi với -에 있다/없다.", "Danh từ + 위/아래/앞/뒤/옆 + 에 있다", "책상 위에 책이 있습니다.", "Có sách ở trên bàn.", "공장 옆에 기숙사가 있어요.", "Ký túc xá ở cạnh nhà máy."],
    ],
    dialogue2: ["Hỏi đường đến hiệu thuốc", "Anh Nguyễn bị đau đầu và hỏi người qua đường.", [
      ["응우옌", "실례합니다. 이 근처에 약국이 있어요?", "Xin lỗi, gần đây có hiệu thuốc không?"],
      ["행인", "네, 편의점 옆에 있어요.", "Có, ở cạnh cửa hàng tiện lợi."],
      ["응우옌", "편의점은 어디에 있어요?", "Cửa hàng tiện lợi ở đâu ạ?"],
      ["행인", "저기 역 앞에 있어요. 이 길로 쭉 가세요.", "Ở trước ga kia. Hãy đi thẳng con đường này."],
      ["응우옌", "멀어요?", "Có xa không?"],
      ["행인", "아니요, 가까워요. 걸어서 오 분 걸려요.", "Không, gần thôi. Đi bộ mất 5 phút."]]],
    culture: { title: "Nơi cần biết và số khẩn cấp", items: [
      { h: "Số khẩn cấp", body: "119: cứu hỏa và cấp cứu; 112: cảnh sát. Hãy lưu sẵn trong điện thoại." },
      { h: "Hiệu thuốc và bệnh viện", body: "약국 bán thuốc, một số thuốc cần đơn của bác sĩ. Khi đi khám nên mang giấy tờ tùy thân và thẻ bảo hiểm nếu có." },
      { h: "Trung tâm hỗ trợ lao động nước ngoài", body: "Nhiều địa phương có trung tâm hỗ trợ lao động nước ngoài, tư vấn bằng nhiều ngôn ngữ về hợp đồng, lương, thủ tục. Hãy hỏi công ty hoặc tra cứu số điện thoại hiện hành." },
      { h: "Biết lối thoát hiểm ngay ngày đầu", body: "Hãy xem vị trí 비상구 (lối thoát hiểm) và 소화기 (bình chữa cháy) ở nơi làm việc và ký túc xá ngay từ ngày đầu." },
    ] },
  },
};
