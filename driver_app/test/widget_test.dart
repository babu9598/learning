import 'package:flutter_test/flutter_test.dart';
import 'package:vaago_driver_app/main.dart';

void main() {
  testWidgets('Driver App loads smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const VaaGoDriverApp());
    expect(find.byType(VaaGoDriverApp), findsOneWidget);
  });
}
