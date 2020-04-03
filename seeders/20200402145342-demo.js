'use strict';

/* eslint-disable camelcase */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('entities', [
      {
        id: 1,
        name: 'FactFact',
      },
      {
        id: 2,
        name: 'World Virus Organization',
      },
    ]);

    await queryInterface.bulkInsert('messages', [
      {
        id: 1,
        content:
          '一名剛回港正接受強製傢居檢疫人士懷疑自己感染新冠肺炎故意外出而且到處對服務員吐口水散播病毒。大家分享出去提醒其他人。一名萬寧同事懷疑中招請病假，其他同事所以才將CCTV 片段放出来',
      },
      {
        id: 2,
        content: '英國首相約翰遜在社交網站證實，感染新型冠狀病毒 (3/27/19:22)',
      },
    ]);

    await queryInterface.bulkInsert('topics', [
      {
        id: 1,
        message_id: 1,
        published: true,
        conclusion: 'falsy',
        title: '家居檢疫人士吐口水散播病毒',
      },
      {
        id: 2,
        message_id: 2,
        published: true,
        conclusion: 'truthy',
        title: '英國首相確診新型冠狀病毒',
      },
    ]);

    await queryInterface.bulkInsert('responses', [
      {
        id: 1,
        topic_id: 1,
        type: 'review',
        published: true,
        conclusion: 'falsy',
        entity_id: 1,
        content:
          '疫情下市面口罩缺貨，港人繼續為口罩及其他消毒衛生用品「瘋狂」。其中個人護理用品連鎖店萬寧有部分門市今日有少量口罩出售，各區均有大批市民到場排隊，期間有落空的市民不滿，指罵職員。其中在荃灣荃新天地二期，有大批民眾今早到萬寧門外排隊，等候購買口罩、酒精搓手液和洗手液。至今早約11時，該分店僅有10盒口罩出售，有落空的市民不滿，大聲指罵職員。',
      },
      {
        id: 2,
        topic_id: 2,
        type: 'response',
        published: true,
        conclusion: 'truthy',
        entity_id: 2,
        content:
          '約翰遜在社交網站公布這個消息，指自己出現輕微症狀，檢測後證實感染新型冠狀病毒。他正在自我隔離，但會透過視像會議領導英國政府同病毒作戰，相信會戰勝疫情。唐寧街十號首相府表示，約翰遜星期四覺得不舒服，接受首席醫官檢查。醫護人員替他做病毒測試，證實呈陽性反應。',
      },
    ]);

    await queryInterface.bulkInsert('reports', [
      {
        id: 1,
        topic_id: 1,
        content:
          '一名剛回港正接受強製傢居檢疫人士懷疑自己感染新冠肺炎故意外出而且到處對服務員吐口水散播病毒。大家分享出去提醒其他人。一名萬寧同事懷疑中招請病假，其他同事所以才將CCTV 片段放出来',
        source: 'whatsapp',
        closed: false,
      },
      {
        id: 2,
        content:
          '戴口罩很重要。冠狀病毒證實是空氣傳播！日本醫生用了高科技的攝影器材，拍攝了冠狀病毒在空氣中的情況。這攝影機能攝錄0.1微米（10’000 份之一微米）',
        source: 'whatsapp',
        closed: false,
      },
      {
        id: 3,
        topic_id: 2,
        content: '英國首相約翰遜在社交網站證實，感染新型冠狀病毒 (3/27/19:22)',
        source: 'whatsapp',
        closed: false,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('reports', null, {});
    await queryInterface.bulkDelete('responses', null, {});
    await queryInterface.bulkDelete('topics', null, {});
    await queryInterface.bulkDelete('messages', null, {});
    await queryInterface.bulkDelete('entities', null, {});
  },
};
