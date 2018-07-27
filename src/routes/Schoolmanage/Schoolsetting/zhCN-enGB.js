//短信设置
export const Note = (lang) => {
    switch(lang){
        case 'zhCN':
              return    {
                            title: '短信设置',
                            connect: '短信这是说明，这是一个短信设置界面',
                            remain: '短信剩余',
                            chargeTitle: '短信充值',
                            charge: '充值',
                            messageResidue: '可用短信剩余',
                            recentConsumption: '近30天消费',
                        };
              break;
        case 'enGB':
              return    {
                            title: 'Note Setting',
                            connect: 'Text message this is the explanation, this is a text message setting interface',
                            remain: 'SMS remaining',
                            chargeTitle: 'SMS top-up',
                            charge: 'charge',
                            messageResidue: 'Available message residue',
                            recentConsumption: 'Nearly 30 days consumption',
                        };
        default: break;
      }
}