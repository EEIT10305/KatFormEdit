katctbc.applyDoc = function () {
  return {
    katType: 'div',
    className: 'katHTMLForm',
    fontSize: '14px',
    content: [
      [
        {
          katType: 'label',
          text: 'SETTING FORM 1',
          width: '100%',
          fontSize: '30px',
          fontWeight: 'bold',
          letterSpacing: '15px',
          textAlign: 'center'
        }
      ],
      [
        {
          katType: 'katLabelInput',
          label: 'LABEL1_1:',
          width: '30%',
          dataKey: 'applyReceiveBank',
        },
        {
          katType: 'katLabelInput',
          label: 'LABEL1_2:',
          width: '30%',
          dataKey: 'applyReceiveBank',
        }
      ],
      [
        {
          katType: 'katLabelInput',
          label: 'LABEL2_1:',
          width: '30%',
          textAlign: 'right',
          dataKey: 'CURRENCY',
          dataIsSync: 'Y',
        },
        {
          katType: 'katLabelInput',
          label: 'LABEL2_2:',
          width: '30%',
          textAlign: 'right',
          dataKey: 'CURRENCY',
          dataIsSync: 'Y',
        },
      ],
      [
        {
          katType: 'button',
          id: 'addAppTableBtn',
          className: 'btn-sm-add btn-light',
          width: '100%',
          funname: 'addAppTableBtn'
        },
      ],
      [
        {
          katType: 'katTable',
          thead: [
            { text: 'TH1', width: '4%' },
            {
              katType: 'katLabelInput',
              className: 'katInputNoBorder',
              width: '8%',
              dataKey: 'Table2_TH1'
            },
            {
              katType: 'katLabelInput',
              className: 'katInputNoBorder',
              width: '8%',
              dataKey: 'Table2_TH2'
            },

            {
              katType: 'katLabelInput',
              className: 'katInputNoBorder',
              width: '8%',
              dataKey: 'Table2_TH3'
            },
            {
              katType: 'katLabelInput',
              className: 'katInputNoBorder',
              width: '8%',
              dataKey: 'Table2_TH4'
            },
            {
              katType: 'katLabelInput',
              className: 'katInputNoBorder',
              width: '8%',
              dataKey: 'Table2_TH5'
            },
            {
              katType: 'katLabelInput',
              className: 'katInputNoBorder',
              width: '8%',
              dataKey: 'Table2_TH6'
            },
            {
              katType: 'katLabelInput',
              className: 'katInputNoBorder',
              width: '8%',
              dataKey: 'Table2_TH7'
            },
            {
              katType: 'katLabelInput',
              className: 'katInputNoBorder',
              width: '8%',
              dataKey: 'Table2_TH8'
            },
            {
              katType: 'katLabelInput',
              className: 'katInputNoBorder',
              width: '8%',
              dataKey: 'Table2_TH9'
            },
            {
              katType: 'katLabelInput',
              className: 'katInputNoBorder',
              width: '8%',
              dataKey: 'Table2_TH10'
            },
            {
              katType: 'katLabelInput',
              className: 'katInputNoBorder',
              width: '8%',
              dataKey: 'Table2_TH11'
            },
          ],
          tbody: [
            [
              { text: 'TD1' },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD1_1',
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD1_2'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD1_3'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD1_4'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD1_5'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD1_6'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD1_7'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD1_8'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD1_9'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD1_10'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD1_11'
              },
            ],
            [
              { text: 'TD2' },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD2_1'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD2_2'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD2_3'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD2_4'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD2_5'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD2_6'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD2_7'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD2_8'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD2_9'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD2_10'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'Table2_TD2_11'
              },
            ],
          ],
          className: 'katApplyDocumentTable',
          width: '100%',
          dataKey: 'applyDocTable4'
        }
      ],
      [
        {
          katType: 'katCheckbox',
          options: [{ value: '1', text: '1.CONTENT CONTENT' }],
          width: '21%',
          dataKey: 'QUES1',
        },
        {
          katType: 'katLabelInput',
          label: '',
          unit: 'CONTENT',
          width: '18%',
          dataKey: 'QUES1_INPUT1',
        },
        {
          katType: 'div',
          width: '61%',
        },
      ],
      [
        {
          katType: 'div',
          id: 'justADiv',
          height: '150px'
        }
      ],
      [
        {
          katType: 'katTable',
          thead: [
            {
              text: 'TD1_1',
              width: '10%',
            },
            {
              katType: 'katLabelInput',
              className: 'katInputNoBorder',
              label: 'TD1_2:',
              width: '15%',
              borderRight: '2px solid gray',
              dataKey: 'BANK_TH1'
            },

            {
              katType: 'katLabelInput',
              label: 'TD1_3:',
              className: 'katInputNoBorder',
              colspan: 2,
              borderRight: '2px solid gray',
              dataKey: 'BANK_TH2'
            },
            {
              katType: 'katLabelInput',
              className: 'katInputNoBorder',
              label: 'TD1_4:',
              colspan: 3,
              dataKey: 'BANK_TH3'
            },
          ],
          tbody: [
            [
              { text: 'TD2_1' },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                borderRight: '2px solid gray',
                dataKey: 'BANK_TD11'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                label: 'TD2_3:',
                colspan: 2,
                borderRight: '2px solid gray',
                dataKey: 'BANK_TD12'
              },
              {
                text: 'TD2_4',
                rowspan: 2,
                width: '15%',
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                label: 'TD2_5:',
                dataKey: 'BANK_TD13'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                label: 'TD2_6:',
                dataKey: 'BANK_TD14'
              },
            ],
            [
              { text: 'TD3_1' },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                borderRight: '2px solid gray',
                dataKey: 'BANK_TD21'
              },
              { text: 'TD3_3', width: '60px' },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                width: '12%',
                borderRight: '2px solid gray',
                dataKey: 'BANK_TD22'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'BANK_TD23'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                dataKey: 'BANK_TD24'
              },
            ],
            [
              { text: 'TD4_1' },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                borderRight: '2px solid gray',
                dataKey: 'BANK_TD31'
              },
              { text: 'TD4_3', width: '60px' },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                width: '12%',
                borderRight: '2px solid gray',
                dataKey: 'BANK_TD32'
              },
              { text: 'TD4_4', colspan: 3, },
            ],
            [
              {
                text: 'TD5_1',
                rowspan: 2,
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                label: 'TD5_2:',
                unit: '天',
                borderRight: '2px solid gray',
                marginRight: '25px',
                dataKey: 'BANK_TD41'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                label: 'TD5_3:',
                unit: '%',
                colspan: 2,
                borderRight: '2px solid gray',
                marginRight: '100px',
                dataKey: 'BANK_TD42'
              },
              {
                katType: 'katTextarea',
                className: 'katTextAreaNoBorder',
                colspan: 3,
                rowspan: 2,
                dataKey: 'BANK_TD43'
              },
            ],
            [
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                label: 'TD6_2:',
                unit: '天',
                borderRight: '2px solid gray',
                marginRight: '25px',
                dataKey: 'BANK_TD51'
              },
              {
                katType: 'katLabelInput',
                className: 'katInputNoBorder',
                label: 'TD6_3:',
                unit: '%',
                colspan: 2,
                borderRight: '2px solid gray',
                marginRight: '100px',
                dataKey: 'BANK_TD52'
              },
            ],
          ],
          width: 'calc(95% - 50px)',
          className: 'katApplyDocumentTable',
          dataKey: 'applyDocTable3'
        },
      ],
      [
        {
          katType: 'label',
          text: 'O-103 107.11',
        },
        {
          katType: 'label',
          text: '(Please continue to page 2)',
          width: '24%',
        },
      ],
      [
        {
          katType: 'div',
          className: 'katDivider',
        },
      ],
    ],
  };
}
