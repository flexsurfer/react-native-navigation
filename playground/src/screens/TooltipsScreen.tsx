import { NavigationComponent, NavigationComponentProps, Options } from 'react-native-navigation';
import Navigation from '../services/Navigation';
import React from 'react';

import Root from '../components/Root';
import Button from '../components/Button';
import Screens from './Screens';
import testIDs from '../testIDs';
import { stack } from '../commons/Layouts';
interface Props extends NavigationComponentProps {
  enablePushBottomTabs: boolean;
}
export default class TooltipsScreen extends NavigationComponent<Props> {
  public static defaultProps = {
    enablePushBottomTabs: true,
  };

  static options(): Options {
    return {
      topBar: {
        title: {
          text: 'Tooltips screen',
        },
        rightButtons: [
          {
            text: 'Hit',
            id: 'HitRightButton',
          },
        ],
        backButton: {
          testID: testIDs.BACK_BUTTON,
        },
      },
      layout: {
        orientation: ['portrait', 'landscape'],
      },
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  render() {
    return (
      <Root componentId={this.props.componentId}>
        <Button
          label="Show on BottomTabs under TopBar Button"
          testID={testIDs.SHOW_TOOLTIP_MAIN_BTMTABS_TPBAR_HIT}
          onPress={async () => this.showTooltips('bottomTabs', 'HitRightButton', 'bottom')}
        />
        <Button
          label="Show on LayoutsStack under TopBar Button"
          testID={testIDs.SHOW_TOOLTIP_LAYOUT_STACK_TPBAR_HIT}
          onPress={async () => this.showTooltips('LayoutsStack', 'HitRightButton', 'bottom')}
        />
        <Button
          label="Show on this component under TopBar Button"
          testID={testIDs.SHOW_TOOLTIP_COMPONENT_TPBAR_HIT}
          onPress={async () =>
            this.showTooltips(this.props.componentId, 'HitRightButton', 'bottom')
          }
        />

        <Button label="Push a screen " testID={testIDs.PUSH_BTN} onPress={this.push} />
        <Button
          label="Push a screen different TopBar Buttons "
          testID={testIDs.PUSH_PUSHED_SCREEN}
          onPress={this.pushNoButtons}
        />
        <Button label="showModal" testID={testIDs.MODAL_BTN} onPress={this.showModal} />
        <Button label="Extra Flows" onPress={this.pushExtraFlows} />
      </Root>
    );
  }
  pushExtraFlows = async () => {
    return await Navigation.push(this.props.componentId, Screens.TooltipsScreenExtra);
  };
  dismissTooltip = async (compId: string) => {
    return await Navigation.dismissOverlay(compId);
  };

  showTooltips = async (
    layoutId: string,
    anchor: string,
    gravity: 'top' | 'bottom' | 'left' | 'right' = 'top'
  ) => {
    const res = await Navigation.showOverlay(
      Screens.Tooltip,
      {
        overlay: {
          attach: {
            layoutId: layoutId,
            anchor: {
              id: anchor,
              gravity: gravity,
            },
          },
        },
      },
      {
        dismissTooltip: this.dismissTooltip,
      }
    );
    console.log('tooltip ', res);
  };

  showModal = async () => {
    await Navigation.showModal(stack(Screens.TooltipsScreen));
  };

  push = async () => {
    await Navigation.push(this.props.componentId, Screens.TooltipsScreen);
  };

  pushNoButtons = async () => {
    await Navigation.push(this.props.componentId, Screens.Pushed);
  };
  pushBottomTabs = async () => {
    await Navigation.push(this.props.componentId, {
      bottomTabs: {
        id: 'innerBottomTabs',
        children: [
          {
            component: {
              name: Screens.TooltipsScreen,
              passProps: {
                enablePushBottomTabs: false,
              },
              options: {
                bottomTab: {
                  icon: require('../../img/whatshot.png'),
                  id: 'innerTooltipsScreenBottomTab',
                  text: 'TooltipsScreen',
                  testID: testIDs.TOOLTIPS_SCREEN_BTN,
                },
              },
            },
          },
          {
            component: {
              name: Screens.Pushed,
              options: {
                bottomTab: {
                  icon: require('../../img/plus.png'),
                  id: 'non-press-tab',
                  selectTabOnPress: false,
                  text: 'Tab 3',
                  testID: testIDs.THIRD_TAB_BAR_BTN,
                },
              },
            },
          },
        ],
        options: {
          hardwareBackButton: {
            bottomTabsOnPress: 'previous',
          },
          bottomTabs: {
            testID: testIDs.BOTTOM_TABS,
          },
        },
      },
    });
  };
}
